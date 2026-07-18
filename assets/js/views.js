/**
 * views.js — every screen of the KB browser app
 * =============================================
 *
 * WHAT THIS IS
 *   One exported render function per route (see router.js):
 *
 *     renderHome     #/                search box, type pills, recent pages
 *     renderSearch   #/search?q=…      ranked results
 *     renderType     #/type/<type>     type definition + all pages of type
 *     renderPage     #/page/<path>     fetch + render one markdown page
 *     renderNotFound anything else
 *
 *   Each function receives a context object built in app.js:
 *     { root, manifest, searchEntries, summaryByPath }
 *   and replaces root's contents. All DOM is built with the el() helper —
 *   no innerHTML for user data except the markdown renderer's output,
 *   which is safe because markdown.js escapes all source HTML.
 *
 * SAFE TO CUSTOMIZE
 *   - Copy in this file is yours to rewrite (headings, empty states…).
 *   - Add sections to the home view; add fields to result rows.
 *   - RECENT_COUNT below.
 *
 * WILL BREAK THINGS
 *   - Class names here are styled in assets/css/site.css — rename in both.
 *   - The link-rewriting logic in resolveRelative()/makeResolvers() is what
 *     keeps relative markdown links working on the site; edit with care.
 */

import { routes } from "./router.js";
import { repoInfo, repoUrl, CONFIG } from "./config.js";
import { render as renderMarkdown, stripFrontmatter } from "./markdown.js";
import { search } from "./search.js";

/** How many pages the "recently updated" home section shows. */
const RECENT_COUNT = 6;

/* ------------------------------------------------------------------ */
/* DOM helpers                                                         */
/* ------------------------------------------------------------------ */

/**
 * el("a", { href: "#/", class: "pill" }, "Home") → HTMLElement.
 * Children may be strings (become text nodes), elements, or arrays.
 */
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue;
    if (k === "class") node.className = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const child of children.flat(Infinity)) {
    if (child == null) continue;
    node.append(child.nodeType ? child : document.createTextNode(child));
  }
  return node;
}

/** Replace root's children and scroll to top (feels like a page change). */
function mount(root, ...children) {
  root.replaceChildren(...children.flat(Infinity).filter(Boolean));
  window.scrollTo(0, 0);
}

/* ------------------------------------------------------------------ */
/* Pills — frontmatter rendered as chips                               */
/* ------------------------------------------------------------------ */

/** Clickable type pill → #/type/<type>. Tinted per type via CSS class. */
function typePill(type) {
  if (!type) return null;
  return el("a", { class: `pill pill-type-${type}`, href: routes.type(type) }, type);
}

/** Clickable tag pill → a search for that tag. */
function tagPill(tag) {
  return el("a", { class: "pill", href: routes.search(tag) }, `#${tag}`);
}

/**
 * Render one non-type, non-tags frontmatter field as a pill:
 *  - URL values become real links;
 *  - everything else is an inert labeled chip ("source: unverified").
 */
function fieldPill(key, value) {
  const text = Array.isArray(value) ? value.join(", ") : String(value);
  if (/^https?:\/\//i.test(text)) {
    return el(
      "a",
      { class: "pill pill-inert", href: text, target: "_blank", rel: "noopener", title: text },
      el("span", { class: "pill-key" }, `${key}: `),
      text.replace(/^https?:\/\//i, "").slice(0, 40)
    );
  }
  return el(
    "span",
    { class: "pill pill-inert", title: `${key}: ${text}` },
    el("span", { class: "pill-key" }, `${key}: `),
    text.slice(0, 60)
  );
}

/** The full pill row for a page's frontmatter. */
function frontmatterPills(page) {
  const skip = new Set(["type", "tags", "title"]); // rendered elsewhere
  const pills = [typePill(page.type), (page.tags || []).map(tagPill)];
  for (const [key, value] of Object.entries(page.frontmatter || {})) {
    if (skip.has(key) || value == null || value === "") continue;
    if (typeof value === "object" && !Array.isArray(value)) {
      // Nested maps (e.g. kb-card entry_points): one pill per child.
      for (const [k2, v2] of Object.entries(value)) pills.push(fieldPill(`${key}.${k2}`, v2));
    } else {
      pills.push(fieldPill(key, value));
    }
  }
  return el("div", { class: "pill-row" }, pills);
}

/* ------------------------------------------------------------------ */
/* Link rewriting for rendered pages                                   */
/* ------------------------------------------------------------------ */

/**
 * Resolve href relative to the directory of pagePath and normalize ../ and
 * ./ segments. "kb/topics/a.md" + "../templates/note.md" → "kb/templates/note.md".
 */
function resolveRelative(pagePath, href) {
  const baseParts = pagePath.split("/").slice(0, -1); // drop the filename
  const parts = [...baseParts];
  for (const seg of href.split("/")) {
    if (seg === "" || seg === ".") continue;
    else if (seg === "..") parts.pop();
    else parts.push(seg);
  }
  return parts.join("/");
}

/**
 * Build the resolveLink/resolveImage hooks for markdown.render():
 *  - external links (http/https/mailto) and pure #anchors pass through;
 *  - relative *.md links become #/page/<resolved> routes (with any #anchor
 *    preserved after the route);
 *  - other relative links (images, PDFs…) resolve to repo-root-relative
 *    URLs, which work because the whole repo is the deployed artifact.
 */
function makeResolvers(pagePath) {
  return {
    resolveLink(href) {
      if (/^(https?:|mailto:)/i.test(href)) return href;
      // Pure in-page anchors (#section) must stay on this page's route —
      // a bare "#section" hash would be misread as an app route.
      if (href.startsWith("#")) return routes.page(pagePath) + href;
      const [file, anchor] = href.split("#");
      if (/\.md$/i.test(file)) {
        const resolved = resolveRelative(pagePath, file);
        return routes.page(resolved) + (anchor ? `#${anchor}` : "");
      }
      return resolveRelative(pagePath, href);
    },
    resolveImage(src) {
      if (/^(https?:|data:)/i.test(src)) return src;
      return resolveRelative(pagePath, src);
    },
  };
}

/* ------------------------------------------------------------------ */
/* Shared fragments                                                    */
/* ------------------------------------------------------------------ */

/** One result row (used by search + type + recent listings). */
function resultRow(page) {
  return el(
    "a",
    { class: "kb-result", href: routes.page(page.path) },
    el(
      "div",
      { class: "pill-row" },
      el("span", { class: "r-title" }, page.title),
      typePill(page.type)
    ),
    page.summary ? el("p", { class: "r-summary" }, page.summary) : null,
    el("div", { class: "r-path" }, page.path)
  );
}

/** The search input; navigates to #/search?q=… on Enter. */
function searchBox(initial = "", autofocus = false) {
  const input = el("input", {
    class: "kb-search-box",
    type: "search",
    placeholder: "Search the knowledge base…",
    value: initial,
    "aria-label": "Search the knowledge base",
    onkeydown: (e) => {
      if (e.key === "Enter" && input.value.trim()) {
        window.location.hash = routes.search(input.value.trim());
      }
    },
  });
  if (autofocus) queueMicrotask(() => input.focus());
  return input;
}

/** Distinct content types present in the manifest (templates define more). */
function typesInUse(manifest) {
  const counts = new Map();
  for (const p of manifest.pages) {
    if (p.reserved || !p.type || ["index", "log"].includes(p.type)) continue;
    counts.set(p.type, (counts.get(p.type) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

/* ------------------------------------------------------------------ */
/* Views                                                               */
/* ------------------------------------------------------------------ */

/** #/ — search-forward home. */
export function renderHome(ctx) {
  const { root, manifest } = ctx;
  document.title = CONFIG.siteTitle;

  const typePills = typesInUse(manifest).map(([type, count]) =>
    el("a", { class: `pill pill-type-${type}`, href: routes.type(type) }, `${type} (${count})`)
  );

  const recent = manifest.pages
    .filter((p) => !p.reserved && p.type !== "index" && p.type !== "log" && p.modified)
    .sort((a, b) => (b.modified || "").localeCompare(a.modified || ""))
    .slice(0, RECENT_COUNT);

  mount(
    root,
    searchBox("", true),
    typePills.length
      ? [el("div", { class: "kb-section-label" }, "Browse by type"),
         el("div", { class: "pill-row" }, typePills)]
      : null,
    el("div", { class: "kb-section-label" }, "Start here"),
    el(
      "div",
      { class: "card-grid" },
      el(
        "a",
        { class: "card", href: routes.page("kb/_index.md") },
        el("h3", {}, "Start at the index"),
        el("p", {}, "The KB's own front door — the curated map of everything it knows.")
      ),
      el(
        "a",
        { class: "card", href: routes.page("kb/templates/_index.md") },
        el("h3", {}, "Browse the types"),
        el("p", {}, "Every entity type, defined by its template.")
      ),
      el(
        "a",
        { class: "card", href: routes.page("kb-card.md") },
        el("h3", {}, "Read the kb-card"),
        el("p", {}, "What this KB is about, who owns it, and what's out of scope.")
      )
    ),
    recent.length
      ? [el("div", { class: "kb-section-label" }, "Recently updated"), recent.map(resultRow)]
      : el("p", { class: "kb-loading" }, "No content pages yet — the KB is waiting for its first ingest."),
  );
}

/** #/search?q=… — ranked keyword results. */
export function renderSearch(ctx, route) {
  const { root, manifest, searchEntries, summaryByPath } = ctx;
  const q = route.query || "";
  document.title = `${q ? q + " — " : ""}search — ${CONFIG.siteTitle}`;

  const results = search(q, searchEntries, summaryByPath);
  const pageByPath = new Map(manifest.pages.map((p) => [p.path, p]));

  mount(
    root,
    searchBox(q, !q),
    el("div", { class: "kb-section-label" },
      q ? `${results.length} result${results.length === 1 ? "" : "s"} for “${q}”` : "Type to search"),
    results.length
      ? results.map(({ entry }) => resultRow(pageByPath.get(entry.path) || entry))
      : q
        ? el("p", { class: "kb-loading" },
            "Nothing matched. Try fewer or shorter terms — search needs every term to appear somewhere on the page.")
        : null
  );
}

/** #/type/<type> — the type's template definition + all pages of that type. */
export async function renderType(ctx, route) {
  const { root, manifest } = ctx;
  const type = route.type;
  document.title = `${type} — ${CONFIG.siteTitle}`;

  const pages = manifest.pages.filter((p) => p.type === type && !p.reserved);

  // The template page IS the type's definition — render it at the top.
  const templatePath = `kb/templates/${type}.md`;
  const defBox = el("div", { class: "kb-type-def md-body" }, el("p", { class: "kb-loading" }, "Loading definition…"));

  mount(
    root,
    el("div", { class: "pill-row" }, el("a", { href: routes.home() }, "← Home")),
    el("h1", {}, `Type: ${type}`),
    defBox,
    el("div", { class: "kb-section-label" }, `${pages.length} page${pages.length === 1 ? "" : "s"} of this type`),
    pages.length
      ? pages.map(resultRow)
      : el("p", { class: "kb-loading" }, "No pages of this type yet."),
  );

  try {
    const res = await fetch(templatePath);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { body } = stripFrontmatter(await res.text());
    defBox.innerHTML = renderMarkdown(body, makeResolvers(templatePath));
    defBox.append(
      el("p", {},
        el("a", { href: routes.page(templatePath) }, "View the full template →"))
    );
  } catch {
    defBox.replaceChildren(
      el("p", {}, `No template found at ${templatePath} — this type has no definition yet. `,
        el("a", { href: routes.page("kb/templates/_index.md") }, "See all templates."))
    );
  }
}

/** #/page/<path> — fetch and render one markdown page. */
export async function renderPage(ctx, route) {
  const { root, manifest } = ctx;
  const path = route.path;

  // Only render markdown from within the repo — refuse absolute/parent paths.
  if (!path || path.startsWith("/") || path.includes("..") || !path.endsWith(".md")) {
    return renderNotFound(ctx, { hash: `/page/${path}` });
  }

  const page = manifest ? manifest.pages.find((p) => p.path === path) : null;
  document.title = `${page ? page.title : path} — ${CONFIG.siteTitle}`;

  mount(root, el("p", { class: "kb-loading" }, `Loading ${path}…`));

  let raw;
  try {
    // Relative fetch: the deployed artifact is the whole repo, so the .md
    // file sits next to knowledge-base.html at exactly this path.
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    raw = await res.text();
  } catch (err) {
    return mount(
      root,
      el("h1", {}, "Page not found"),
      el(
        "div",
        { class: "notice" },
        el("p", {}, `Couldn't fetch “${path}” (${err.message}). `,
          "It may not exist yet — in this KB a broken link marks knowledge worth writing."),
        el("p", {},
          el("a", { href: routes.home() }, "← Back to search"), " · ",
          el("a", { href: routes.page("kb/_index.md") }, "Open the index"))
      )
    );
  }

  const { body } = stripFrontmatter(raw);
  const bodyEl = el("div", { class: "md-body" });
  // Safe: markdown.js escapes all raw HTML in the source (see its header).
  bodyEl.innerHTML = renderMarkdown(body, makeResolvers(path));

  // Affordance bar: canonical file, edit, feedback, history — all on GitHub.
  const { branch } = repoInfo();
  const base = repoUrl();
  const gh = (kind) => `${base}/${kind}/${branch}/${path}`;
  const issueUrl = `${base}/issues/new?title=${encodeURIComponent(`Feedback: ${path}`)}`;

  const header = el(
    "header",
    { class: "kb-page-header" },
    el("div", { class: "pill-row" }, el("a", { href: routes.home() }, "← Home")),
    el("h1", {}, page ? page.title : path.split("/").pop().replace(/\.md$/, "")),
    page ? frontmatterPills(page) : null,
    el(
      "nav",
      { class: "kb-affordances", "aria-label": "Page actions" },
      el("a", { href: gh("blob"), target: "_blank", rel: "noopener" }, "View on GitHub"),
      el("a", { href: gh("edit"), target: "_blank", rel: "noopener" }, "Edit this page"),
      el("a", { href: issueUrl, target: "_blank", rel: "noopener" }, "Open an issue"),
      el("a", { href: `${base}/commits/${branch}/${path}`, target: "_blank", rel: "noopener" }, "History")
    )
  );

  mount(root, header, bodyEl);

  // If the route carried an in-page anchor (#/page/x.md#section), jump to it.
  if (route.anchor) document.getElementById(route.anchor)?.scrollIntoView();
}

/** Fallback for unknown hashes. */
export function renderNotFound(ctx, route) {
  const { root } = ctx;
  document.title = `Not found — ${CONFIG.siteTitle}`;
  mount(
    root,
    el("h1", {}, "Nothing at this address"),
    el(
      "div",
      { class: "notice" },
      el("p", {}, `The route “#${route.hash || ""}” doesn't match anything. `,
        "Valid routes: #/, #/search?q=…, #/type/<type>, #/page/<path-to.md>."),
      el("p", {}, el("a", { href: routes.home() }, "← Back to search"))
    )
  );
}

/** Shown when assets/data/manifest.json is missing (fresh clone, no build). */
export function renderNoManifest(root) {
  mount(
    root,
    el("h1", {}, "The index hasn't been built yet"),
    el(
      "div",
      { class: "notice" },
      el("p", {}, "This app needs assets/data/manifest.json, which is generated from the markdown in kb/."),
      el("p", {}, "Locally: run ", el("code", {}, "node scripts/build-index.mjs"),
        " and refresh. On GitHub: push to main (or run the Pages workflow) and the Action builds it for you.")
    )
  );
}
