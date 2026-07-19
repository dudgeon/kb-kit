#!/usr/bin/env node
/**
 * lint-kb.mjs — mechanical health check for the kb/ bundle
 * ========================================================
 *
 * WHAT THIS IS
 *   The deterministic half of the lint skill (skills/lint/SKILL.md): the
 *   checks that need no judgment, promoted to a script so agents, humans,
 *   and CI all run the same sweep. Zero dependencies; Node >= 18.
 *
 *     node scripts/lint-kb.mjs           # human-readable report
 *     node scripts/lint-kb.mjs --json    # machine-readable (for agents)
 *
 * WHAT IT CHECKS
 *   Errors (exit 1 — CI should fail):
 *     E1 unparseable/missing frontmatter, or missing `type`, on KB pages
 *     E2 a `type` with no template in kb/templates/
 *     E3 [[wikilinks]] outside code spans/fences (the kit's hardest rule)
 *     E4 absolute /path links (break GitHub rendering)
 *   Warnings (exit 0 — reported, never fatal):
 *     W1 broken relative links — SANCTIONED here: a link to an unwritten
 *        page marks knowledge worth writing (see AGENTS.md). Read the list;
 *        fix typos; leave real gaps.
 *     W2 pages unreachable from kb/_index.md by following links
 *     W3 orphan pages (nothing links to them)
 *     W4 missing `summary`/`source` frontmatter (the soft floor)
 *     W5 items sitting in kb/inbox/ (the queue should trend toward empty)
 *
 * WHAT IT EXEMPTS (by contract — see the folders' _index.md files)
 *   - `_index.md` / `_log.md` everywhere: reserved files, no floor.
 *   - kb/inbox/**       : raw drops, no format requirements (W5 counts them).
 *   - kb/sources/raw/** : immutable archived originals, never linted.
 *   - kb/templates/*    : type definitions; exempt from summary/source.
 *
 * WHAT IT DOES *NOT* DO
 *   The editorial passes — orphan placement, drift, contradictions, type
 *   pressure, kb-card refresh — need judgment and stay with the lint skill.
 *
 * SAFE TO CUSTOMIZE
 *   - Add checks as functions that push to `errors` / `warnings`.
 *   - If your fork adds another raw-material folder, add it to EXEMPT_DIRS.
 *
 * WILL BREAK THINGS
 *   - Making W1 (broken links) fatal: deliberate dangling links are a
 *     feature of this KB; CI-failing them forces busywork pages.
 */

import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const KB = join(REPO_ROOT, "kb");
const JSON_MODE = process.argv.includes("--json");

/** Folders whose contents are exempt from every per-page check. */
const EXEMPT_DIRS = ["kb/inbox", "kb/sources/raw"];

const posix = (p) => relative(REPO_ROOT, p).split(sep).join("/");
// An exempt folder's own _index.md is its CONTRACT page — machinery, not a
// raw drop — so it stays fully checked; only the folder's contents are exempt.
const inExemptDir = (rel) =>
  EXEMPT_DIRS.some((d) => rel.startsWith(d + "/")) && !rel.endsWith("/_index.md");

// ---------------------------------------------------------------------------
// Walk kb/ (everything — exemptions are applied per-check, not in the walk,
// so the inbox count and link *targets* in exempt folders still resolve).
// ---------------------------------------------------------------------------

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".")) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else if (e.isFile()) out.push(full);
  }
  return out.sort();
}

const allFiles = walk(KB);
const mdFiles = allFiles.filter((f) => f.endsWith(".md"));

const templates = existsSync(join(KB, "templates"))
  ? readdirSync(join(KB, "templates"))
      .filter((n) => n.endsWith(".md") && !n.startsWith("_"))
      .map((n) => n.replace(/\.md$/, ""))
  : [];

// ---------------------------------------------------------------------------
// Per-file checks
// ---------------------------------------------------------------------------

const errors = [];
const warnings = [];
const pages = {}; // rel -> { reserved, type, links[] }

/** Remove fenced blocks and inline code so examples never trip link rules. */
function stripCode(src) {
  return src.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
}

for (const f of mdFiles) {
  const rel = posix(f);
  const name = f.split(sep).pop();
  const reserved = name === "_index.md" || name === "_log.md";
  const exempt = inExemptDir(rel);
  const isTemplate = rel.startsWith("kb/templates/") && !reserved;
  const src = readFileSync(f, "utf8");

  // --- frontmatter floor (E1/E2, W4) -------------------------------------
  let fm = {};
  const m = src.match(/^---\n([\s\S]*?)\n---/);
  if (m) {
    for (const line of m[1].split("\n")) {
      const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
      if (kv) fm[kv[1]] = kv[2];
    }
  }
  if (!reserved && !exempt) {
    if (!m) errors.push(`E1 ${rel}: no frontmatter block`);
    else if (!fm.type) errors.push(`E1 ${rel}: frontmatter missing \`type\``);
    else if (!isTemplate && !["index", "log", "kb-card"].includes(fm.type) && !templates.includes(fm.type))
      errors.push(`E2 ${rel}: type '${fm.type}' has no template in kb/templates/`);
    if (m && !isTemplate) {
      if (!fm.summary) warnings.push(`W4 ${rel}: missing \`summary\``);
      if (!fm.source && !reserved) warnings.push(`W4 ${rel}: missing \`source\``);
    }
  }

  // --- link rules (E3/E4, W1) --------------------------------------------
  const body = stripCode(src);
  const links = [];
  if (!exempt) {
    if (/\[\[[^\]]+\]\]/.test(body)) errors.push(`E3 ${rel}: [[wikilink]] outside code`);
    for (const lm of body.matchAll(/\]\(([^)\s#]+)(#[^)]*)?\)/g)) {
      const href = lm[1];
      if (/^(https?:|mailto:)/.test(href)) continue;
      if (href.startsWith("/")) { errors.push(`E4 ${rel}: absolute link ${href}`); continue; }
      const target = resolve(dirname(f), href);
      links.push(posix(target));
      if (!existsSync(target)) warnings.push(`W1 ${rel}: dangling link -> ${href}`);
    }
  }
  pages[rel] = { reserved, exempt, isTemplate, links };
}

// ---------------------------------------------------------------------------
// Graph checks: reachability from the root index (W2) and orphans (W3)
// ---------------------------------------------------------------------------

const reach = new Set();
const queue = ["kb/_index.md"];
while (queue.length) {
  const cur = queue.shift();
  if (reach.has(cur)) continue;
  reach.add(cur);
  for (const l of pages[cur]?.links ?? []) if (pages[l] && !reach.has(l)) queue.push(l);
}
for (const rel of Object.keys(pages))
  if (!reach.has(rel) && !pages[rel].exempt)
    warnings.push(`W2 ${rel}: unreachable from kb/_index.md`);

const inbound = {};
for (const info of Object.values(pages))
  for (const l of info.links) (inbound[l] ??= 0), inbound[l]++;
for (const [rel, info] of Object.entries(pages))
  if (!info.reserved && !info.exempt && !inbound[rel])
    warnings.push(`W3 ${rel}: orphan (no page links to it)`);

// --- inbox queue depth (W5) ------------------------------------------------
const inboxItems = allFiles
  .map(posix)
  .filter((r) => r.startsWith("kb/inbox/") && !r.endsWith("_index.md"));
for (const r of inboxItems) warnings.push(`W5 ${r}: waiting in the inbox`);

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const summary = {
  checked: mdFiles.length,
  errors: errors.length,
  warnings: warnings.length,
  inbox_waiting: inboxItems.length,
};

if (JSON_MODE) {
  console.log(JSON.stringify({ summary, errors, warnings }, null, 2));
} else {
  for (const e of errors) console.error(`ERROR   ${e}`);
  for (const w of warnings) console.log(`warning ${w}`);
  console.log(
    `lint-kb: ${summary.checked} file(s) checked — ` +
    `${summary.errors} error(s), ${summary.warnings} warning(s)` +
    (summary.inbox_waiting ? `, ${summary.inbox_waiting} inbox item(s) waiting` : "")
  );
}

process.exit(errors.length ? 1 : 0);
