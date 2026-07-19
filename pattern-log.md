# Pattern log — changes to the kit machinery

This ledger tracks changes to the **pattern** — everything that is not KB
content: the site, skills, scripts, workflows, schema files, and structural
conventions. (`kb/_log.md` tracks knowledge; this file tracks machinery.)

Why it exists: forks customize the kit, and upstream keeps improving. A
planned **upgrade skill** will compare this file across fork and upstream to
recommend — change by change, with judgment, never a blind merge — which
upstream improvements a fork should pull in, without squashing the fork's
own customizations. That only works if every machinery change lands here.

Rules (see AGENTS.md → "Customizing the kit"):

- Newest first, under `## YYYY-MM-DD` headings.
- Every entry starts with its provenance: `upstream |` in kb-kit itself,
  `fork |` in your fork. **Never edit or remove entries you didn't write** —
  upstream entries in a fork are the upgrade skill's baseline.
- On fork setup, the setup skill records a `fork-point |` anchor (upstream
  repo, commit, date) so "since when?" always has an answer.
- One bullet per coherent change: what changed, which files, and why in a
  clause. Write it in the same commit as the change.

## 2026-07-19

- upstream | Voice rule (ADR 011): all user-facing surfaces are educational
  and descriptive, never salesy; AGENTS.md's "Writing for the kit's
  surfaces" section enforces keeping index.html/README current with
  machinery changes. Files: AGENTS.md, meta/PLAN.md (product principles).
- upstream | KB home redesigned per maintainer feedback: LIVE search
  (debounced as-you-type, in-place result updates, silent hash sync — "Enter
  only" read as broken), "Ways to use this KB" cards (casual browse vs
  agent/RAG/MCP paths), "How to add knowledge" doors (session "/ingest
  this", prefilled issue link, GitHub new-file-in-inbox link), old
  "Start here" cards removed. Files: assets/js/views.js, assets/css/site.css.
- upstream | Intake channels widened (ADR 012): ingest sweeps scan open
  GitHub issues alongside kb/inbox/ and serve in-session "/ingest this";
  lint checks issues when checking the inbox. Files: skills/ingest/SKILL.md,
  skills/lint/SKILL.md.
- upstream | kb-card as discovery interface (ADR 013): spec gains
  `external_sources` + the hub/crawler discovery trajectory; AGENTS.md
  points agents at the card; setup interviews for external sources. Files:
  docs/kb-card-spec.md, kb-card.md, AGENTS.md, skills/setup/SKILL.md.

## 2026-07-18

- upstream | Search index scope widened to the whole repo (maintainer
  directive): every .md (root files, docs/, skills/) plus the two HTML
  pages; still excluded: kb/inbox/, kb/sources/raw/, meta/, dot-folders.
  Non-kb pages have no `type`; home "recently updated" stays kb-only; HTML
  search results link directly. Files: scripts/build-index.mjs,
  assets/js/views.js.
- upstream | Build made deterministic: `modified` = last git commit date
  (was mtime), `generated_at` = newest content date (was wall-clock), so CI
  rebuilds of unchanged content are byte-identical and the freshness
  backstop no longer commits timestamp churn on every push. Footer wording:
  "content updated". Files: scripts/build-index.mjs, assets/js/app.js.
- upstream | Setup hardened by a fork dry-run: kept folders always keep a
  one-line `_index.md`; `kb/sources/_index.md` always survives (raw/ lives
  beneath it); removing a demo template now updates `kb/templates/_index.md`.
  Files: skills/setup/SKILL.md, scripts/lint-kb.mjs.
- upstream | Mechanical lint promoted to `scripts/lint-kb.mjs` (zero-dep,
  `--json` for agents) and added as a CI step. Errors fail CI (frontmatter
  floor, wikilinks, absolute links); dangling links stay warnings by design.
  Files: scripts/lint-kb.mjs, .github/workflows/build-index.yml,
  skills/lint/SKILL.md.
- upstream | Inbox→ingest→archive flow (ADR 009): `kb/inbox/` = unprocessed
  queue; ingest MOVES originals to `kb/sources/raw/` (immutable archive) —
  nothing deleted; neither folder search-indexed. Home page adds the
  keyword-only search note, a copyable clone-and-`claude /query` command,
  and a "How knowledge gets in" section; page view falls back to
  frontmatter titles for unindexed pages. Files: skills/{ingest,lint,setup},
  scripts/build-index.mjs, assets/js/views.js, assets/css/site.css,
  AGENTS.md.
- upstream | Pages deployment switched to deploy-from-branch (ADR 008, firm):
  root `.nojekyll` (load-bearing for underscore paths), committed
  `assets/data/*.json` as canonical, Actions demoted to a CI freshness
  backstop. Files: .nojekyll, .github/workflows/build-index.yml (replaces
  pages.yml), README, docs/site-guide.md, index.html, knowledge-base.html.
- upstream | Agent-managed boundary (ADR 007): `kb/` is agent-managed;
  everything else is human-authoritative, in query scope, propose-only.
  Files: AGENTS.md, skills/{query,ingest,lint}.
- upstream | Kit established: OKF bundle (`kb/`, two deviations), four
  agent-agnostic skills, kb-card (declared + lint-inferred), taxonomy,
  client-rendered no-SSG site with committed search index. Baseline for all
  future entries.
