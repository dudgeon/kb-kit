/**
 * router.js — hash-based routing for the KB browser app
 * =====================================================
 *
 * WHAT THIS IS
 *   The tiny router that maps the URL fragment (everything after #) to a
 *   view name + parameters. Hash routing means the whole app is ONE html
 *   file (knowledge-base.html) served statically — no server rewrites, no
 *   per-page HTML, works on GitHub Pages as-is.
 *
 * ROUTE TABLE
 *   #/                    → { view: "home" }
 *   #/search?q=okf        → { view: "search", query: "okf" }
 *   #/type/note           → { view: "type", type: "note" }
 *   #/page/kb/topics/x.md → { view: "page", path: "kb/topics/x.md" }
 *   anything else         → { view: "notfound", hash }
 *
 * SAFE TO CUSTOMIZE
 *   - Add a route: add a branch in parseHash() and a matching renderer in
 *     views.js (see the dispatch table in app.js).
 *
 * WILL BREAK THINGS
 *   - Changing the route prefixes (#/page/, #/type/, #/search): views.js
 *     generates links with these exact prefixes, and external links to KB
 *     pages would rot. Change both together if you must.
 */

/** Parse the current (or a given) location.hash into a route object. */
export function parseHash(hash = window.location.hash) {
  // Normalize: drop the leading "#", tolerate a missing or bare hash.
  let h = hash.startsWith("#") ? hash.slice(1) : hash;
  if (h === "" || h === "/") return { view: "home" };

  // #/search?q=... — the query string rides inside the hash.
  if (h.startsWith("/search")) {
    const qs = h.includes("?") ? h.slice(h.indexOf("?") + 1) : "";
    const params = new URLSearchParams(qs);
    return { view: "search", query: params.get("q") || "" };
  }

  // #/type/<type>
  if (h.startsWith("/type/")) {
    return { view: "type", type: decodeURIComponent(h.slice("/type/".length)) };
  }

  // #/page/<path> — path contains slashes, so take everything after the
  // prefix. A second "#" marks an in-page anchor: #/page/x.md#section.
  if (h.startsWith("/page/")) {
    const rest = h.slice("/page/".length);
    const [path, anchor] = rest.split("#");
    return {
      view: "page",
      path: decodeURIComponent(path),
      anchor: anchor ? decodeURIComponent(anchor) : null,
    };
  }

  return { view: "notfound", hash: h };
}

/** Build hash URLs (use these instead of string-concatenating in views). */
export const routes = {
  home: () => "#/",
  search: (q) => `#/search?q=${encodeURIComponent(q)}`,
  type: (t) => `#/type/${encodeURIComponent(t)}`,
  // Page paths keep their slashes readable (encode only what must be).
  page: (p) => `#/page/${p.split("/").map(encodeURIComponent).join("/")}`,
};

/**
 * Subscribe to route changes. Fires once immediately for the initial URL,
 * then on every hashchange. Returns an unsubscribe function.
 */
export function onRouteChange(callback) {
  const handler = () => callback(parseHash());
  window.addEventListener("hashchange", handler);
  handler();
  return () => window.removeEventListener("hashchange", handler);
}
