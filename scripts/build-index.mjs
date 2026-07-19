#!/usr/bin/env node
/**
 * build-index.mjs — generates the JSON data files that power the KB site.
 * =======================================================================
 *
 * WHAT THIS IS
 *   The only "build step" in kb-kit. It walks EVERY markdown file in the
 *   repo (kb/ content, root docs, docs/, skills/ — see the scope note at
 *   HTML_PAGES/SKIP_DIRS below) plus the two HTML pages, parses YAML
 *   frontmatter with a small built-in parser, and writes two files:
 *
 *     assets/data/manifest.json      — structured metadata for every page
 *                                      (drives the home view, type views,
 *                                      pills, and recently-updated list)
 *     assets/data/search-index.json  — per-page normalized text blobs
 *                                      (drives client-side keyword search)
 *
 *   The site itself never parses markdown metadata at runtime for listings —
 *   it reads these JSON files. Page *bodies* are fetched raw and rendered
 *   client-side by assets/js/markdown.js; this script never emits HTML.
 *
 * HOW IT FITS (data flow)
 *   kb/**\/*.md ──> node scripts/build-index.mjs ──> assets/data/*.json
 *                                                      │
 *   knowledge-base.html + assets/js/* ◀── fetch ───────┘
 *
 *   The GitHub Action (.github/workflows/pages.yml) runs this on every push
 *   before deploying, so pushing markdown is enough — no local build needed.
 *   For local preview run:  node scripts/build-index.mjs
 *
 * REQUIREMENTS / INVARIANTS
 *   - Node >= 18, ZERO npm dependencies (node:fs / node:path only).
 *   - Never crash on bad YAML: malformed frontmatter is recorded as a
 *     warning in the manifest and the page is still indexed.
 *   - Run from anywhere: paths are resolved relative to this script's repo.
 *
 * SAFE TO CUSTOMIZE
 *   - EXTRA_DOCS: add/remove kit docs that should be searchable.
 *   - EXCERPT_WORDS / BLOB_MAX_CHARS: tune sizes.
 *   - Add fields to the page records (the client tolerates unknown keys).
 *
 * WILL BREAK THINGS
 *   - Renaming the output files or moving assets/data/ (the client fetches
 *     these exact relative paths).
 *   - Removing `path`, `title`, `type`, `tags`, `summary`, or `reserved`
 *     from page records (the client reads all of them).
 *   - Adding npm dependencies (the Pages workflow runs this with bare node).
 */

import { readdirSync, readFileSync, statSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, relative, dirname, sep } from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// Configuration — safe to customize
// ---------------------------------------------------------------------------

/** Repo root = parent of the scripts/ directory this file lives in. */
const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Directory whose markdown becomes the knowledge base. */
const KB_DIR = "kb";

/**
 * Indexing scope (maintainer directive, 2026-07-18): EVERY markdown file in
 * the repo is indexed — kb/ content, root files (README, AGENTS.md,
 * kb-card.md, pattern-log.md…), docs/, skills/ — plus the HTML pages listed
 * below. Exceptions are SKIP_DIRS (raw material) and meta/ (upstream
 * kit-development files, deleted before release); dot-folders (.claude,
 * .github) are skipped by the walker. Non-kb pages carry no frontmatter
 * `type`, so they appear in search but never in type pills or listings.
 */
const HTML_PAGES = ["index.html", "knowledge-base.html"];

/** Where the JSON output goes (the client fetches from here). */
const OUT_DIR = join(REPO_ROOT, "assets", "data");

/** Approximate word count for the manifest excerpt. */
const EXCERPT_WORDS = 40;

/** Max characters of normalized body text per page in the search index. */
const BLOB_MAX_CHARS = 2000;

// ---------------------------------------------------------------------------
// Tiny YAML frontmatter parser — deliberately minimal, never throws
// ---------------------------------------------------------------------------
// Supports the subset OKF-style frontmatter actually uses:
//   key: scalar                     (strings, numbers, booleans, null)
//   key: "quoted" / 'quoted'        (quotes stripped)
//   key: [a, b, "c d"]              (flow list)
//   key:                            (block list)
//     - item
//     - "quoted item"
//   key:                            (one level of nested map, e.g. kb-card
//     child: value                   entry_points — stored as an object)
// Anything it can't understand becomes a warning string, not an exception.
// Unknown keys are always kept — that mirrors the AGENTS.md rule "never drop
// a key you didn't write".

/** Convert a raw scalar token to a JS value (strip quotes, coerce basics). */
function parseScalar(raw) {
  const s = raw.trim();
  if (s === "") return "";
  // Quoted string: strip the quotes, keep content verbatim.
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  if (s === "true") return true;
  if (s === "false") return false;
  if (s === "null" || s === "~") return null;
  // Number (int or float) — but not things like "2026-07-18" (dates stay strings).
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  return s;
}

/** Parse a flow list like `[a, b, "c, d"]` respecting quotes. */
function parseFlowList(raw) {
  const inner = raw.trim().slice(1, -1); // strip [ ]
  if (inner.trim() === "") return [];
  const items = [];
  let cur = "";
  let quote = null;
  for (const ch of inner) {
    if (quote) {
      cur += ch;
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      cur += ch;
    } else if (ch === ",") {
      items.push(parseScalar(cur));
      cur = "";
    } else {
      cur += ch;
    }
  }
  if (cur.trim() !== "") items.push(parseScalar(cur));
  return items;
}

/**
 * Parse the frontmatter block (the lines between the `---` fences).
 * Returns { data, warnings }. Never throws.
 */
function parseFrontmatter(block) {
  const data = {};
  const warnings = [];
  const lines = block.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "" || line.trim().startsWith("#")) continue; // blank / comment

    // Top-level `key: value` (key must start at column 0).
    const m = line.match(/^([A-Za-z0-9_][A-Za-z0-9_.\- ]*):(.*)$/);
    if (!m) {
      // Indented lines are handled by the key that owns them; a stray one
      // (or anything else unrecognizable) becomes a warning, not a crash.
      if (!/^\s/.test(line)) warnings.push(`unparseable line: ${line.trim().slice(0, 80)}`);
      continue;
    }

    const key = m[1].trim();
    const rest = m[2].trim();

    if (rest.startsWith("[")) {
      // Flow list on one line.
      data[key] = rest.endsWith("]")
        ? parseFlowList(rest)
        : (warnings.push(`unterminated flow list for '${key}'`), rest);
    } else if (rest !== "") {
      // Plain scalar.
      data[key] = parseScalar(rest);
    } else {
      // Bare `key:` — look ahead for a block list or a nested map.
      const items = [];
      const map = {};
      let mode = null; // "list" | "map"
      let j = i + 1;
      for (; j < lines.length; j++) {
        const sub = lines[j];
        if (sub.trim() === "") continue;
        if (!/^\s/.test(sub)) break; // back to column 0 = new top-level key
        const li = sub.match(/^\s+-\s*(.*)$/);
        const mi = sub.match(/^\s+([A-Za-z0-9_][A-Za-z0-9_.\-]*):\s*(.*)$/);
        if (li && mode !== "map") {
          mode = "list";
          items.push(parseScalar(li[1]));
        } else if (mi && mode !== "list") {
          mode = "map";
          map[mi[1]] = parseScalar(mi[2]);
        } else {
          warnings.push(`unparseable nested line under '${key}': ${sub.trim().slice(0, 60)}`);
        }
      }
      i = j - 1; // resume after the consumed block
      data[key] = mode === "list" ? items : mode === "map" ? map : null;
    }
  }
  return { data, warnings };
}

/**
 * Split a markdown file into { frontmatter, warnings, body }.
 * Files without a frontmatter fence get empty frontmatter — never an error.
 */
function splitFrontmatter(text) {
  // Fence must open on the very first line (BOM tolerated).
  const src = text.replace(/^﻿/, "");
  if (!src.startsWith("---")) return { data: {}, warnings: [], body: src };
  const end = src.indexOf("\n---", 3);
  if (end === -1) {
    return { data: {}, warnings: ["frontmatter fence never closed"], body: src };
  }
  const block = src.slice(src.indexOf("\n") + 1, end);
  const body = src.slice(src.indexOf("\n", end + 1) + 1);
  const { data, warnings } = parseFrontmatter(block);
  return { data, warnings, body };
}

// ---------------------------------------------------------------------------
// Markdown text utilities (for excerpts and the search blob)
// ---------------------------------------------------------------------------

/** Collect the text of every `## ` heading (h2) in a markdown body. */
function extractH2s(body) {
  const out = [];
  for (const line of body.split(/\r?\n/)) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) out.push(stripInline(m[1]));
  }
  return out;
}

/** First `# ` heading (h1), used as a title fallback. */
function extractH1(body) {
  const m = body.match(/^#\s+(.+?)\s*$/m);
  return m ? stripInline(m[1]) : null;
}

/** Remove inline markdown syntax from a single line of text. */
function stripInline(s) {
  return s
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // images -> alt text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> label
    .replace(/`([^`]*)`/g, "$1") // inline code
    .replace(/(\*\*|__|\*|_|~~)/g, "") // emphasis markers
    .trim();
}

/** Reduce a markdown body to plain lowercased text for indexing/excerpts. */
function toPlainText(body) {
  return body
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/<!--[\s\S]*?-->/g, " ") // HTML comments
    .split(/\r?\n/)
    .map((line) =>
      stripInline(
        line
          .replace(/^#{1,6}\s+/, "") // heading markers
          .replace(/^\s*>\s?/, "") // blockquote markers
          .replace(/^\s*([-*+]|\d+\.)\s+/, "") // list markers
          .replace(/^\s*\|/, "") // table pipes (leading)
          .replace(/\|/g, " ") // table pipes (inner)
          .replace(/^[-=\s|:]+$/, "") // hr / table separator rows
      )
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

/** First ~n words of plain text, with an ellipsis if truncated. */
function excerpt(plain, n) {
  const words = plain.split(" ").filter(Boolean);
  if (words.length <= n) return words.join(" ");
  return words.slice(0, n).join(" ") + "…";
}

// ---------------------------------------------------------------------------
// File walking
// ---------------------------------------------------------------------------

/**
 * Folders that are deliberately NOT indexed:
 *   kb/inbox        — the unprocessed queue: raw drops, unvetted text.
 *   kb/sources/raw  — the immutable archive of ingested originals; indexing
 *                     verbatim full texts would drown the distilled pages
 *                     in keyword search.
 *   meta            — upstream kit-development files; deleted pre-release
 *                     and never part of a fork's KB.
 * All stay viewable by direct #/page/ link (the page view fetches raw
 * markdown); they just never appear in search or type listings.
 */
const SKIP_DIRS = new Set(["kb/inbox", "kb/sources/raw", "meta"]);

/** Recursively list every .md file under dir (absolute paths, sorted). */
function walkMarkdown(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue; // skip hidden files/dirs
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      const rel = relative(REPO_ROOT, full).split(sep).join("/");
      if (SKIP_DIRS.has(rel)) continue;
      out.push(...walkMarkdown(full));
    } else if (entry.isFile() && entry.name.endsWith(".md")) out.push(full);
  }
  return out.sort();
}

// ---------------------------------------------------------------------------
// Build one page record
// ---------------------------------------------------------------------------

/**
 * `modified` provenance: last git commit date for the file (stable across
 * checkouts, so CI rebuilds are byte-identical unless content changed —
 * the freshness backstop stays quiet on timestamp-only churn). Falls back
 * to filesystem mtime for uncommitted files or non-git checkouts.
 */
function lastModified(absPath) {
  try {
    const iso = execSync(
      `git log -1 --format=%cI -- "${relative(REPO_ROOT, absPath)}"`,
      { cwd: REPO_ROOT, stdio: ["ignore", "pipe", "ignore"] }
    ).toString().trim();
    if (iso) return new Date(iso).toISOString();
  } catch { /* not a git checkout — fall through */ }
  return statSync(absPath).mtime.toISOString();
}

/** Visible text of an HTML page: comments, scripts, styles, tags stripped. */
function htmlToPlainText(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, " ")                    // dev-note comments are NOT content
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Page record for one of the HTML_PAGES (no frontmatter, no type). */
function buildHtmlPage(absPath) {
  const relPath = relative(REPO_ROOT, absPath).split(sep).join("/");
  const raw = readFileSync(absPath, "utf8");
  const title = raw.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() || relPath;
  const plain = htmlToPlainText(raw);
  const page = {
    path: relPath,
    title,
    type: null,          // not a KB entity: searchable, never in type views
    summary: null,
    tags: [],
    reserved: false,
    frontmatter: {},
    headings: [],
    excerpt: excerpt(plain, EXCERPT_WORDS),
    modified: lastModified(absPath),
  };
  const blob = [title, plain].join(" ").toLowerCase().replace(/\s+/g, " ").slice(0, BLOB_MAX_CHARS);
  return { page, searchEntry: { path: relPath, title, type: null, tags: [], blob } };
}

function buildPage(absPath) {
  const relPath = relative(REPO_ROOT, absPath).split(sep).join("/"); // posix paths in JSON
  if (relPath.endsWith(".html")) return buildHtmlPage(absPath);
  const raw = readFileSync(absPath, "utf8");
  const { data, warnings, body } = splitFrontmatter(raw);
  const plain = toPlainText(body);
  const filename = relPath.split("/").pop().replace(/\.md$/, "");

  // Reserved structural pages (_index.md, _log.md) are flagged so views can
  // treat them specially (e.g. exclude from "recently updated" cards).
  const reserved = filename === "_index" || filename === "_log";

  // Title precedence: frontmatter title > first # heading > filename.
  const title = typeof data.title === "string" && data.title
    ? data.title
    : extractH1(body) || filename;

  const page = {
    // Core fields the client depends on — do not remove.
    path: relPath,
    title,
    type: typeof data.type === "string" ? data.type : null,
    summary: typeof data.summary === "string" ? data.summary : (typeof data.description === "string" ? data.description : null),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    reserved,
    // Everything else from frontmatter, kept verbatim (unknown keys survive).
    frontmatter: data,
    // Navigation aids.
    headings: extractH2s(body),
    excerpt: excerpt(plain, EXCERPT_WORDS),
    // Last git commit date (ISO) — powers "recently updated"; mtime only
    // as a fallback. See lastModified() for why this must be git-derived.
    modified: lastModified(absPath),
  };
  if (warnings.length) page.warnings = warnings;

  // Search-index record for the same page.
  const blobParts = [
    title,
    page.summary || "",
    page.tags.join(" "),
    page.headings.join(" "),
    plain,
  ];
  const blob = blobParts.join(" ").toLowerCase().replace(/\s+/g, " ").slice(0, BLOB_MAX_CHARS);
  const searchEntry = { path: relPath, title, type: page.type, tags: page.tags, blob };

  return { page, searchEntry };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const files = [
    ...walkMarkdown(REPO_ROOT),
    ...HTML_PAGES.map((p) => join(REPO_ROOT, p)).filter((p) => existsSync(p)),
  ];

  const pages = [];
  const searchEntries = [];
  let warningCount = 0;

  for (const file of files) {
    try {
      const { page, searchEntry } = buildPage(file);
      pages.push(page);
      searchEntries.push(searchEntry);
      if (page.warnings) warningCount += page.warnings.length;
    } catch (err) {
      // A truly unreadable file becomes a stub record, never a build failure.
      const relPath = relative(REPO_ROOT, file).split(sep).join("/");
      pages.push({
        path: relPath,
        title: relPath.split("/").pop().replace(/\.md$/, ""),
        type: null,
        summary: null,
        tags: [],
        reserved: false,
        frontmatter: {},
        headings: [],
        excerpt: "",
        modified: null,
        warnings: [`failed to read/parse: ${err.message}`],
      });
      warningCount += 1;
    }
  }

  const manifest = {
    // When the indexed content last changed (max of page `modified` dates),
    // NOT wall-clock build time — shown in the site footer. Deterministic on
    // purpose: rebuilding unchanged content must produce byte-identical
    // JSON, or the CI freshness backstop would commit timestamp churn on
    // every push.
    generated_at: pages.reduce((m, p) => (p.modified && p.modified > m ? p.modified : m), ""),
    // Hints only: the client derives owner/repo from its own URL and falls
    // back to CONFIG in assets/js/config.js. These help local preview.
    repo: { kb_dir: KB_DIR, default_branch: "main" },
    page_count: pages.length,
    warning_count: warningCount,
    pages,
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  writeFileSync(join(OUT_DIR, "search-index.json"), JSON.stringify({ generated_at: manifest.generated_at, entries: searchEntries }, null, 2) + "\n");

  // One-line summary (the workflow log and humans both read this).
  console.log(
    `build-index: indexed ${pages.length} page(s) (${warningCount} warning(s)) → assets/data/manifest.json + search-index.json`
  );
}

main();
