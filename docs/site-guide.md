# Site guide — how the kb-kit site works and how to customize it

This guide is for the humans and agents who maintain a fork's site. The KB
content conventions live in [AGENTS.md](../AGENTS.md); this file covers only
the machinery: the two HTML pages, the JS/CSS under `assets/`, the build
script, and the Pages workflow.

## How the site works

There is no static-site generator and no server. One script turns markdown
into JSON; one single-page app renders everything else on the fly:

```
kb/**/*.md  (+ docs/*.md, kb-card.md)
     │
     │  node scripts/build-index.mjs        ← run by CI on every push
     ▼
assets/data/manifest.json        page metadata: titles, types, tags,
assets/data/search-index.json    summaries, headings, search blobs
     │
     │  fetch() at runtime
     ▼
knowledge-base.html + assets/js/*.js        ← ONE app shell, hash-routed
     │
     │  fetch("kb/topics/whatever.md")      ← raw markdown, same artifact
     ▼
client-side render (assets/js/markdown.js) → what the visitor sees
```

Key consequence: **pushing markdown is the whole publish flow.** The GitHub
Action ([.github/workflows/pages.yml](../.github/workflows/pages.yml))
rebuilds the JSON and redeploys the entire repo as the Pages artifact, so
the app can fetch any `.md` file by its repo-relative path.

### The pieces

| File | Role |
| --- | --- |
| `index.html` | static marketing/explainer page (no JS needed) |
| `knowledge-base.html` | the app shell; mounts `#app`, loads `assets/js/app.js` |
| `assets/js/config.js` | repo owner/name detection + fork fallback (**edit first**) |
| `assets/js/router.js` | `#/…` hash → route object |
| `assets/js/views.js` | one render function per route; pills, affordances, link rewriting |
| `assets/js/search.js` | substring, multi-term-AND, field-weighted scoring |
| `assets/js/markdown.js` | dependency-free md → HTML renderer (escapes all raw HTML) |
| `assets/css/site.css` | all styling; design tokens at the top |
| `scripts/build-index.mjs` | markdown → JSON (Node ≥ 18, zero dependencies) |

### Routes

- `#/` — search box, type pills, recently updated
- `#/search?q=okf` — ranked results
- `#/type/note` — the type's template rendered as its definition, plus all pages of that type
- `#/page/kb/topics/context-repo.md` — any markdown file rendered in the viewer (works for `docs/*.md` and `kb-card.md` too; supports `#/page/x.md#section` anchors)

## Local preview

```sh
node scripts/build-index.mjs      # regenerate assets/data/*.json
python3 -m http.server 8000       # serve the repo root
# open http://localhost:8000/  and  http://localhost:8000/knowledge-base.html
```

Any static file server works — the requirement is only that the repo root is
the web root (the app fetches `assets/…` and `kb/…` relative to itself).
GitHub links (Edit / History / Open an issue) use the `CONFIG` fallback in
`assets/js/config.js` when running locally, so set your owner/repo there.

## Customizing

### Colors, branding, typography

Everything visual flows from the CSS custom properties in **section 1 of
[assets/css/site.css](../assets/css/site.css)**: accent colors, surfaces,
per-type pill tints, fonts, radii, layout widths. Light and dark are the
same token names — dark overrides live in one
`@media (prefers-color-scheme: dark)` block. Change tokens, not component
rules, and both themes stay coherent. Header brand text and nav links are
plain HTML near the top of each `.html` file.

### Adding a view

Three edits, one per file (each file's header comment says the same):

1. `router.js` — add a branch to `parseHash()` returning
   `{ view: "yourview", …params }` and a helper in `routes`.
2. `views.js` — export `renderYourView(ctx, route)`; build DOM with the
   `el()` helper and `mount(root, …)`.
3. `app.js` — add `yourview: renderYourView` to the `DISPATCH` table.

### Changing search behavior

Tune the `WEIGHTS` object at the top of `assets/js/search.js` (title vs tag
vs summary vs body, phrase bonus). AND→OR semantics is a documented
one-line change in the same file. What gets indexed — fields, blob length,
which docs outside `kb/` are included — is configured at the top of
`scripts/build-index.mjs` (`EXTRA_DOCS`, `BLOB_MAX_CHARS`).

### Adding a KB type

Site-side, a new type mostly just works: type pills, `#/type/<type>` views,
and search pick it up from the manifest. The one optional edit is a pill
tint — add a `--type-<name>` token pair and a `.pill-type-<name>` rule in
`site.css`; unknown types fall back to the default pill color.

## Hard invariants (do not break these)

These are load-bearing architectural decisions, not preferences:

- **No per-page HTML.** Never generate an HTML twin for a markdown file.
  One shell (`knowledge-base.html`) renders every page from raw `.md`.
  If you want prettier URLs, that's a routing change, not an SSG.
- **No external CDNs, fonts, or libraries.** The site is self-contained and
  strict-CSP-friendly. The markdown renderer is local by design — do not
  swap it for a CDN-hosted parser.
- **Relative fetches only.** `knowledge-base.html` and `index.html` live at
  the repo root and fetch `assets/…`, `kb/…`, `docs/…` relatively, so the
  site works at `https://owner.github.io/repo/`, on custom domains, and on
  localhost without a base-path config.
- **The Pages artifact is the whole repo.** The workflow uploads the repo
  root so raw markdown is fetchable. Don't narrow it to a `dist/`.
- **Raw HTML in markdown stays escaped.** `markdown.js` escapes everything;
  relaxing that means any KB page can inject script into your site (the
  tradeoff is documented in that file's header).
- **Zero npm dependencies.** `build-index.mjs` runs on bare Node ≥ 18 in CI;
  adding a package would break the workflow's no-install design.

## Troubleshooting

- **"The index hasn't been built yet"** — `assets/data/manifest.json` is
  missing. Locally: run `node scripts/build-index.mjs`. On GitHub: push to
  `main` or run the workflow from the Actions tab, and check that
  Settings → Pages → Source is set to **GitHub Actions**.
- **Page 404s in the viewer but exists in the repo** — the deployed
  artifact predates the file; push again. Locally, confirm the server root
  is the repo root.
- **GitHub buttons point at the wrong repo** — on custom domains or
  localhost the owner/repo can't be derived from the URL; set the `CONFIG`
  fallback in `assets/js/config.js`.
- **Frontmatter warnings in the manifest** — the build never fails on bad
  YAML; it records a `warnings` array on the affected page record. Search
  `manifest.json` for `"warnings"` to find pages needing fixes.
