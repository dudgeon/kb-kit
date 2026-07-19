# kb-kit

**A forkable starter kit for building knowledge bases that humans and AI
agents share.** Made for product teams — you don't need to be an engineer to
own a great context repo.

🌐 **[Marketing & guide site](https://dudgeon.github.io/kb-kit/index.html)** ·
📚 **[Browse the demo knowledge base](https://dudgeon.github.io/kb-kit/knowledge-base.html)**

## What this is

Agents are becoming disposable; your team's context is not. A **context
repo** is a versioned folder of markdown that your agents read, write, and
maintain, and your teammates browse, search, and trust — the durable layer
that survives every agent-stack migration.

kb-kit gives you that repo, batteries included:

- **A standards-based structure** — an [Open Knowledge Format](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
  bundle in [`kb/`](./kb/_index.md): markdown + YAML frontmatter, plain
  markdown links, an `_index.md` catalog and `_log.md` history.
- **Agent skills** ([`skills/`](./skills)) — `setup` (onboards your fork),
  `ingest` (add a source, propagate it), `query` (cited answers), `lint`
  (health checks + grading). Agent-agnostic: [`AGENTS.md`](./AGENTS.md) is
  the schema file; works with Claude Code, Codex, Cursor, and friends.
- **A zero-server browsing site** — plain branch-deployed GitHub Pages (no
  Actions required; works on strict enterprise configs). Keyword search,
  clickable frontmatter pills, rendered pages with edit/issue buttons. No
  database, no workers, no build framework.
- **A [kb-card](./kb-card.md)** — a model card for your knowledge base:
  scope, owner, and lint-computed health at a stable path a crawler can find.
  Spec: [docs/kb-card-spec.md](./docs/kb-card-spec.md).
- **A quality taxonomy** — [docs/taxonomy.md](./docs/taxonomy.md): ten
  dimensions of what makes a context repo good or great.

The demo content is a real, browsable survey of the context-management
landscape (OKF, AGENTS.md, Agent Skills, MCP, LLM-wiki pattern, OpenWiki,
Letta, and more) — so everything works the moment you fork.

## Fork it (5 minutes)

1. **Fork** this repo (or "Use this template").
2. **Enable Pages**: Settings → Pages → Source: **Deploy from a branch** →
   `main`, `/ (root)`. Your site appears at
   `https://<you>.github.io/<repo>/`. (The repo's `.nojekyll` file must stay
   — it stops Pages from dropping the `_index.md` files.)
3. **Run setup**: open the repo with any coding agent and say *"run the setup
   skill"*. It interviews you, clears the demo content, installs the entity
   types you actually need, and writes your kb-card.
4. **Ingest something**: paste your first document or link and say *"ingest
   this."*
5. Repeat step 4 forever. That's the whole product.

Prefer to browse before forking? The
[site](https://dudgeon.github.io/kb-kit/knowledge-base.html) needs no clone
and no login.

## Repo map

| Path | What it is |
|---|---|
| `kb/` | The knowledge bundle (OKF) — the only place knowledge lives |
| `kb/inbox/` → `kb/sources/raw/` | The flow in: drop raw material in the inbox (= unprocessed queue); ingest distills it and moves the original to the immutable raw archive |
| `kb-card.md` | This KB's card: scope, owner, computed health |
| `AGENTS.md` / `CLAUDE.md` | Agent schema file (canonical / shim) |
| `skills/` | setup · ingest · query · lint |
| `index.html`, `knowledge-base.html`, `assets/` | The static site |
| `scripts/build-index.mjs` + `.github/workflows/` | Search-index build + CI freshness backstop |
| `docs/` | Taxonomy, kb-card spec, site customization guide |
| `meta/` | Upstream kit-development files (delete in your fork) |

## Design lineage

Karpathy's [LLM-wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
(ingest → query → lint, agent-maintained markdown), formalized against
Google's [Open Knowledge Format v0.1](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing),
with two documented deviations (relative links; `_index.md`/`_log.md`) —
rationale in [`kb/decisions/`](./kb/decisions).

## License

[MIT](./LICENSE). Fork freely, at work or anywhere else — attribution
appreciated.
