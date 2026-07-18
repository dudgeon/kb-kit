/**
 * app.js — the KB browser's entry point (loaded by knowledge-base.html)
 * =====================================================================
 *
 * WHAT THIS IS
 *   The thin shell that wires everything together:
 *     1. fetch the two JSON data files build-index.mjs produced,
 *     2. build the shared context object views receive,
 *     3. subscribe to hash changes and dispatch to the right view.
 *
 * MODULE MAP (each file has its own "safe to customize" header)
 *   config.js   — repo detection + fork settings (edit this first)
 *   router.js   — hash → route object
 *   search.js   — keyword scoring
 *   markdown.js — md → HTML renderer
 *   views.js    — one render function per route
 *   app.js      — (this file) boot + dispatch
 *
 * SAFE TO CUSTOMIZE
 *   - Add a route: extend DISPATCH below + parseHash() in router.js + a
 *     renderer in views.js. That's the whole recipe for a new view.
 *
 * WILL BREAK THINGS
 *   - The relative fetch paths "assets/data/…": knowledge-base.html must
 *     stay at the repo root for these (and for raw kb/*.md fetches) to
 *     resolve. Don't move the HTML file without adjusting every path.
 */

import { onRouteChange } from "./router.js";
import {
  renderHome,
  renderSearch,
  renderType,
  renderPage,
  renderNotFound,
  renderNoManifest,
} from "./views.js";

/** Route view name → renderer. Add new views here. */
const DISPATCH = {
  home: renderHome,
  search: renderSearch,
  type: renderType,
  page: renderPage,
  notfound: renderNotFound,
};

async function boot() {
  const root = document.getElementById("app");

  // ---- 1. Load the build artifacts (relative fetch, works locally too) ---
  let manifest = null;
  let searchIndex = { entries: [] };
  try {
    const [mRes, sRes] = await Promise.all([
      fetch("assets/data/manifest.json"),
      fetch("assets/data/search-index.json"),
    ]);
    if (!mRes.ok) throw new Error(`manifest HTTP ${mRes.status}`);
    manifest = await mRes.json();
    if (sRes.ok) searchIndex = await sRes.json(); // search is optional-ish:
    // with no index the app still browses; searches just return nothing.
  } catch {
    // No manifest at all → friendly build instructions instead of a blank app.
    renderNoManifest(root);
    return;
  }

  // ---- 2. Shared context passed to every view ---------------------------
  const ctx = {
    root,
    manifest,
    searchEntries: searchIndex.entries || [],
    // path → summary, so search can weight summary hits above body hits.
    summaryByPath: new Map(
      manifest.pages.filter((p) => p.summary).map((p) => [p.path, p.summary])
    ),
  };

  // Footer build stamp (progressive detail, not load-bearing).
  const stamp = document.getElementById("build-stamp");
  if (stamp && manifest.generated_at) {
    stamp.textContent = `index built ${manifest.generated_at.slice(0, 16).replace("T", " ")} UTC · ${manifest.page_count} pages`;
  }

  // ---- 3. Route dispatch ------------------------------------------------
  onRouteChange((route) => {
    const renderer = DISPATCH[route.view] || renderNotFound;
    // Renderers may be async (page/type fetch markdown); errors inside them
    // fall through to the notfound view rather than a dead screen.
    Promise.resolve(renderer(ctx, route)).catch((err) => {
      console.error("view failed:", err);
      renderNotFound(ctx, { hash: window.location.hash.slice(1) });
    });
  });
}

boot();
