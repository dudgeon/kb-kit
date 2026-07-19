/**
 * markdown.js — a compact, dependency-free markdown → HTML renderer
 * =================================================================
 *
 * WHAT THIS IS
 *   The client-side renderer the KB app uses to turn raw .md files into
 *   HTML. No external library is fetched (a hard invariant of this site:
 *   no CDNs, strict-CSP friendly). It supports the markdown the KB
 *   conventions actually produce:
 *
 *     headings (# .. ######)        fenced code blocks (```)
 *     paragraphs                    blockquotes (>)
 *     **bold** *italic* `code`      ordered / unordered / nested lists
 *     [links](...) ![images](...)   tables (pipe syntax)
 *     horizontal rules (---)        ~~strikethrough~~
 *
 * SECURITY MODEL (read before changing!)
 *   ALL source text is HTML-escaped before any markup is generated, so raw
 *   HTML in a KB page renders as visible text, never as live markup. That
 *   is the safe default for content agents write. If you truly want
 *   raw-HTML passthrough, remove the escapeHtml() call in renderInline()
 *   and the escape in code-block handling — but then any page in kb/ can
 *   inject script into your site, so only do that for a fully trusted KB.
 *
 * API
 *   render(src, opts) → HTML string
 *     opts.resolveLink(href)  — optional; rewrite link hrefs (the page view
 *                               uses this to turn ./other.md into #/page/…)
 *     opts.resolveImage(src)  — optional; same idea for image sources.
 *   stripFrontmatter(src) → { frontmatter: string|null, body: string }
 *
 * SAFE TO CUSTOMIZE
 *   - Add inline rules in renderInline() (e.g. ==highlight==).
 *   - Add block rules in the main loop of render() (clearly sectioned).
 *
 * WILL BREAK THINGS
 *   - Removing the escaping (see SECURITY MODEL).
 *   - Reordering inline rules carelessly: code spans are extracted FIRST so
 *     emphasis/link syntax inside backticks stays literal.
 */

/* ------------------------------------------------------------------ */
/* Escaping                                                            */
/* ------------------------------------------------------------------ */

/** Escape the five HTML-special characters. Applied to ALL source text. */
export function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ------------------------------------------------------------------ */
/* Frontmatter                                                         */
/* ------------------------------------------------------------------ */

/**
 * Split a raw .md file into its YAML frontmatter block and body.
 * The app never renders frontmatter as markdown — views.js shows the
 * parsed version (from the manifest) as pills instead.
 */
export function stripFrontmatter(src) {
  const text = src.replace(/^﻿/, ""); // tolerate a BOM
  if (!text.startsWith("---")) return { frontmatter: null, body: text };
  const end = text.indexOf("\n---", 3);
  if (end === -1) return { frontmatter: null, body: text };
  const fm = text.slice(text.indexOf("\n") + 1, end);
  const body = text.slice(text.indexOf("\n", end + 1) + 1);
  return { frontmatter: fm, body };
}

/* ------------------------------------------------------------------ */
/* Inline rendering (bold, italic, code, links, images, strike)        */
/* ------------------------------------------------------------------ */

/**
 * Render one run of inline markdown to HTML.
 * Order matters: (1) escape everything, (2) pull code spans out into
 * placeholders so nothing inside backticks is touched, (3) images before
 * links (an image is a link with a leading !), (4) emphasis, (5) restore
 * code spans.
 */
function renderInline(text, opts) {
  let out = escapeHtml(text);

  // (2) Protect code spans. \x00n\x00 placeholders can't occur in escaped text.
  const codeSpans = [];
  out = out.replace(/`([^`]+)`/g, (_, code) => {
    codeSpans.push(`<code>${code}</code>`); // content already escaped above
    return `\x00${codeSpans.length - 1}\x00`;
  });

  // (3a) Images: ![alt](src "title" is not supported — keep it simple).
  out = out.replace(/!\[([^\]]*)\]\(([^()\s]+)\)/g, (_, alt, src) => {
    const resolved = opts.resolveImage ? opts.resolveImage(src) : src;
    return `<img src="${resolved}" alt="${alt}">`;
  });

  // (3b) Links: [label](href). href was escaped, so & is &amp; — valid HTML.
  out = out.replace(/\[([^\]]+)\]\(([^()\s]+)\)/g, (_, label, href) => {
    const resolved = opts.resolveLink ? opts.resolveLink(href) : href;
    // External links open in a new tab; internal (#/… or relative) don't.
    const external = /^https?:\/\//i.test(resolved);
    const extra = external ? ' target="_blank" rel="noopener"' : "";
    return `<a href="${resolved}"${extra}>${label}</a>`;
  });

  // (4) Emphasis. Bold before italic so ** isn't eaten as two *.
  out = out
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/(^|[\s(>])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>")
    .replace(/(^|[\s(>])_([^_\s][^_]*)_/g, "$1<em>$2</em>")
    .replace(/~~([^~]+)~~/g, "<del>$1</del>");

  // (5) Restore code spans.
  out = out.replace(/\x00(\d+)\x00/g, (_, i) => codeSpans[Number(i)]);
  return out;
}

/* ------------------------------------------------------------------ */
/* Block-level parsing                                                 */
/* ------------------------------------------------------------------ */

/** Is this line a list item? Returns {indent, ordered, text} or null. */
function listItem(line) {
  const m = line.match(/^(\s*)([-*+]|\d+[.)])\s+(.*)$/);
  if (!m) return null;
  return { indent: m[1].length, ordered: /\d/.test(m[2]), text: m[3] };
}

/**
 * Render a run of list lines (items + their indented continuations) into
 * nested <ul>/<ol> markup. Recursive on indentation: lines indented deeper
 * than the current level are re-parsed as a sub-list inside the last item.
 */
function renderList(lines, opts) {
  const first = listItem(lines[0]);
  const base = first.indent;
  const tag = first.ordered ? "ol" : "ul";
  const items = []; // each item: { text, childLines[] }

  for (const line of lines) {
    const it = listItem(line);
    if (it && it.indent <= base) {
      items.push({ text: it.text, childLines: [] });
    } else if (items.length) {
      // Deeper item or continuation line → belongs to the last item.
      items[items.length - 1].childLines.push(line);
    }
  }

  const html = items
    .map((item) => {
      let inner = renderInline(item.text, opts);
      if (item.childLines.length) {
        // Child lines that are themselves list items become a nested list;
        // plain continuation lines are appended as text.
        const childListLines = item.childLines.filter((l) => listItem(l));
        const contLines = item.childLines.filter((l) => !listItem(l) && l.trim() !== "");
        if (contLines.length) inner += " " + renderInline(contLines.map((l) => l.trim()).join(" "), opts);
        if (childListLines.length) inner += renderList(childListLines, opts);
      }
      return `<li>${inner}</li>`;
    })
    .join("\n");
  return `<${tag}>\n${html}\n</${tag}>`;
}

/** Is this line a table separator row like |---|:---:|? */
function isTableSeparator(line) {
  return /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line);
}

/** Split a table row into cells, trimming the outer pipes. */
function tableCells(line) {
  let s = line.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|")) s = s.slice(0, -1);
  return s.split("|").map((c) => c.trim());
}

/* ------------------------------------------------------------------ */
/* Main renderer                                                       */
/* ------------------------------------------------------------------ */

/**
 * Render a markdown body (frontmatter already stripped) to an HTML string.
 * See the file header for the option hooks.
 */
export function render(src, opts = {}) {
  const lines = src.split(/\r?\n/);
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // --- Blank line: block separator -------------------------------
    if (line.trim() === "") { i++; continue; }

    // --- HTML comment line: structural marker, not content ---------
    // Lines that are entirely a comment (e.g. the kb-card:inferred
    // markers) are skipped rather than escaped into visible text.
    // Comments inside code fences are unaffected — the fence branch
    // below consumes its lines before this rule ever sees them.
    if (/^\s*<!--.*-->\s*$/.test(line)) { i++; continue; }

    // --- Fenced code block: ```lang … ``` --------------------------
    const fence = line.match(/^```(\S*)\s*$/);
    if (fence) {
      const code = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) { code.push(lines[i]); i++; }
      i++; // skip closing fence (or EOF)
      const langAttr = fence[1] ? ` class="language-${escapeHtml(fence[1])}"` : "";
      out.push(`<pre><code${langAttr}>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }

    // --- Heading: # .. ###### --------------------------------------
    const h = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (h) {
      const level = h[1].length;
      const text = renderInline(h[2], opts);
      // Slug id so #anchor links (e.g. from the taxonomy doc) work.
      const id = h[2].toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
      out.push(`<h${level} id="${id}">${text}</h${level}>`);
      i++;
      continue;
    }

    // --- Horizontal rule: ---, ***, ___ (3+) ------------------------
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      out.push("<hr>");
      i++;
      continue;
    }

    // --- Blockquote: consecutive > lines ----------------------------
    if (/^\s*>/.test(line)) {
      const quoted = [];
      while (i < lines.length && (/^\s*>/.test(lines[i]) || (lines[i].trim() !== "" && quoted.length && !listItem(lines[i]) && !/^#{1,6}\s/.test(lines[i])))) {
        quoted.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      out.push(`<blockquote>${render(quoted.join("\n"), opts)}</blockquote>`);
      continue;
    }

    // --- List: consecutive list/continuation lines ------------------
    if (listItem(line)) {
      const block = [];
      while (i < lines.length && lines[i].trim() !== "" &&
             (listItem(lines[i]) || /^\s{2,}/.test(lines[i]))) {
        block.push(lines[i]);
        i++;
      }
      out.push(renderList(block, opts));
      continue;
    }

    // --- Table: header row + separator row --------------------------
    if (line.includes("|") && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const header = tableCells(line).map((c) => `<th>${renderInline(c, opts)}</th>`).join("");
      i += 2; // skip header + separator
      const rows = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim() !== "") {
        rows.push(`<tr>${tableCells(lines[i]).map((c) => `<td>${renderInline(c, opts)}</td>`).join("")}</tr>`);
        i++;
      }
      // Wrapped so wide tables scroll inside .md-table-wrap (see site.css).
      out.push(`<div class="md-table-wrap"><table><thead><tr>${header}</tr></thead><tbody>${rows.join("\n")}</tbody></table></div>`);
      continue;
    }

    // --- Paragraph: everything else, until a blank/other block ------
    const para = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,6}\s|```|\s*>)/.test(lines[i]) &&
      !listItem(lines[i]) &&
      !/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i]) &&
      !(lines[i].includes("|") && i + 1 < lines.length && isTableSeparator(lines[i + 1]))
    ) {
      para.push(lines[i]);
      i++;
    }
    out.push(`<p>${renderInline(para.join(" "), opts)}</p>`);
  }

  return out.join("\n");
}
