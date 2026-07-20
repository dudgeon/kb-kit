# Handoff — kb-kit build session (2026-07-18)

For the next agent continuing this work (locally, with computer access).
Branch: `claude/kb-starter-kit-2wh4pk` · Draft PR:
https://github.com/dudgeon/kb-kit/pull/1 · Base: `main` (still empty except
stub README; a parallel agent was expected on main but never appeared).

## Read these first

1. [INTERVIEW-LOG.md](./INTERVIEW-LOG.md) — every maintainer Q&A verbatim;
   the decisions there are LOCKED (don't re-ask).
2. [CLAUDE.md](./CLAUDE.md) (this folder) — load-bearing decisions + working
   agreements (one question at a time; maintainer replies from phone).
3. [adr/](./adr) — six ADRs with rationale.
4. Root [AGENTS.md](../AGENTS.md) — the kit's own conventions; the site guide
   is [docs/site-guide.md](../docs/site-guide.md).

## State: everything below is built, verified, committed, pushed

- **KB bundle** `kb/` — OKF v0.1 + two deviations (relative md links only;
  `_index.md`/`_log.md`). 29 content pages + templates + indexes. Link check
  passed (~220 links; 2 deliberate dangling: `standards/a2a.md`,
  `sources/state-of-agent-memory-2026.md`).
- **Skills** `skills/{setup,ingest,query,lint}/SKILL.md`, symlinked into
  `.claude/skills/`. Ingest has a mandatory "fetch honestly" step 0 (see
  incident below).
- **kb-card** `kb-card.md` + spec `docs/kb-card-spec.md` (declared core;
  lint-inferred block between `<!-- kb-card:inferred -->` markers — still
  shows "not yet linted"; running the lint skill once is a good first task).
- **Taxonomy** `docs/taxonomy.md` (10 dimensions × functional/good/great).
- **Site** — NOT an SSG (maintainer directive): `knowledge-base.html` is one
  hash-routed shell (`#/`, `#/search?q=`, `#/type/<t>`, `#/page/<path>`);
  `index.html` is the PM-facing marketing page. Vanilla ES modules in
  `assets/js/` (config/router/search/markdown/views/app), tokens in
  `assets/css/site.css`, zero external CDNs, custom md renderer (escapes raw
  HTML). `scripts/build-index.mjs` (node ≥18, zero deps) emits
  `assets/data/{manifest,search-index}.json`; **deployment model changed
  2026-07-18 (ADR 008, firm maintainer requirement)**: Pages deploys FROM
  THE BRANCH (Settings → Pages → Source: Deploy from a branch → main,
  / root; root `.nojekyll` is load-bearing), and
  `.github/workflows/build-index.yml` is only a CI freshness backstop.
  Verified locally: 47 pages indexed, all URLs 200 via `python3 -m
  http.server`, renderer/router/search exercised via node harness. NOT yet
  verified in a real browser — do that first with computer access.

## Environment limits this session had (why some things are unfinished)

Egress-blocked: x.com + mirrors, cerebras.ai, substack, archive.org. Hence:

- `kb/sources/cerebras-kb-blog.md` — `retrieval: failed`; re-fetch
  https://www.cerebras.ai/blog/how-we-built-our-knowledge-base, replace
  secondhand claims, propagate, drop the caveat.
- `kb/sources/prukalpa-github-for-context.md` — `retrieval: secondary`;
  verify quotes against https://contextandchaos.substack.com/p/the-github-for-context-doesnt-exist
- `kb/sources/karpathy-llm-wiki-gist.md` — quotes via summarizing fetch;
  byte-verify against the gist.

**Incident + standing rule** (maintainer escalation, logged in
INTERVIEW-LOG.md): a retrieval failure was once reported to the maintainer
without the caveat. Evidence problems lead your summary, never trail it;
record them in `retrieval:` frontmatter. Do not repeat this.

## Suggested next tasks (roughly in order)

> **Update 2026-07-19 (redesign session):** the field-manual site redesign
> landed and merged to `main` ([PR #3](https://github.com/dudgeon/kb-kit/pull/3),
> ADR 015) — index.html rewritten to explainer voice, site.css restyled
> (paper/ink/drafting-green, glyph pills), knowledge-base.html header/
> favicon, docs+README currency, JSON rebuilt. No JS behavior changed. An
> independent 4-dimension review caught a pre-commit sequencing bug (JSON
> rebuilt before the doc-prose edits finished → fixed) and 8 pre-existing
> non-regressions (see "Discovered but not fixed" above). **The forward
> plan for the remaining backlog now lives in [NEXT.md](./NEXT.md)** —
> reserved-type glyphs + dead-CSS cleanup (do first), the educational
> KB-home from mockup 3a, a setup-skill dry run, the `upgrade` skill
> (ADR 010), and the queued kb-card interview, each with approach/files/
> open decisions and a recommended sequence. **Post-merge TODO:** verify
> the live Pages URL (https://dudgeon.github.io/kb-kit/) renders the new
> design and serves the fresh search index.

> **Update 2026-07-18 (local agent):** tasks 1–3 and 6 are DONE — site
> browser-verified (all routes, search, dark mode, mobile, 404s; two site
> fixes landed: root index now links folder indexes, renderer skips
> comment-only HTML lines), lint run (kb-card inferred block populated),
> all three sources re-fetched and corrected (Cerebras stack claim was
> wrong in secondary coverage — see kb/_log.md), setup-skill removal list
> verified and its do-not-touch list extended. Since then, three more
> maintainer directives landed: the agent-managed boundary (ADR 007),
> branch-deployed Pages with .nojekyll (ADR 008 — firm), and the
> inbox→ingest→raw-archive flow + honest-search/clone-to-query home
> (ADR 009, interview Q11–Q12). Still open: Pages deployment check after
> merge to main (now: Deploy from a branch); tasks 4 (needs maintainer
> approval) and 5 (Obsidian, needs desktop app). Also since:
> `scripts/lint-kb.mjs` now runs lint's mechanical pass (locally + in
> CI), and a kb-card interview is QUEUED — prep + question list in
> [kb-card-interview-prep.md](./kb-card-interview-prep.md); conduct it
> one question at a time when the maintainer is available. Also QUEUED
> (Q14, ADR 010): build `skills/upgrade/` — diff fork vs upstream
> `pattern-log.md` entries and judgment-recommend upstream pulls; the
> ledger + AGENTS.md discipline + setup fork-point anchor already exist.

1. ~~**Browser-verify the site**~~ DONE (locally; re-check on the live
   Pages URL after merging to main).
2. ~~**Run the lint skill**~~ DONE.
3. ~~**Re-fetch the three blocked sources**~~ DONE.
4. ~~**Scheduled mechanical-lint Action**~~ REJECTED (Q15) — and a
   load-bearing constraint came with it: no server-side/scheduled/headless
   agents anywhere in the kit; CI runs deterministic scripts only. See
   meta/CLAUDE.md.
5. **Obsidian check** — open the repo as a vault; confirm relative links +
   frontmatter behave (maintainer's PMs use Obsidian).
6. **Setup-skill dry run** — simulate a fork onboarding; confirm the demo
   removal list in `skills/setup/SKILL.md` matches reality.
7. Possible upstream PR to `dudgeon/duo`: none required (we adopted duo's
   `_index.md`); see `meta/research/brainkit-duo-notes.md` end-notes.
8. Before public release: delete or archive `meta/` (ADR 006) and remove
   `retrieval`/`unverified` caveats as sources get confirmed.

## Gotchas

- `git add -A` is safe only when no subagents are writing; prefer targeted
  adds.
- `.claude/skills/*` are symlinks — keep them relative; don't flatten.
- `assets/data/*.json` are committed for local preview but regenerated by CI;
  rebuild with `node scripts/build-index.mjs` after any kb/ change. Rebuild
  it LAST, after every prose edit in the same change — build-index snapshots
  file content into the committed JSON (excerpts + search blobs), so a
  rebuild that runs before a doc edit lands ships stale text (hit this
  2026-07-19 landing the redesign: rebuilt once right after the HTML/CSS
  swap, then edited docs/site-guide.md and README.md afterward, which left
  the old "marketing page" phrasing baked into manifest.json/search-
  index.json until a second rebuild caught it).
- The maintainer wants md links everywhere, NEVER wikilinks — including in
  docs and examples (code-fence any `[[...]]` you must show).
- Site pages must stay heavily commented; that's a feature, not noise.

## Discovered but not fixed (2026-07-19, site redesign landing)

An independent review workflow (4 dimensions, adversarially verified) over
the field-manual redesign (ADR 015) confirmed 8 findings I chose not to act
on because they're pre-existing behavior in the design-tool-approved
`site.css`, not something the redesign broke:

- **Reserved types render without a glyph.** `assets/js/views.js`'s
  `typePill()` builds `class="pill pill-type-<type>"` for whatever a page's
  frontmatter declares, including the three reserved system types
  (`index`, `log`, `kb-card`) — `site.css` only defines glyph rules for the
  six curated content types (note/topic/source/decision/standard/tool).
  This matches `docs/site-guide.md`'s documented fallback ("unknown types
  render as a plain monochrome pill with no glyph") and the OLD system had
  the same gap (only 6 `--type-*` tint pairs existed pre-redesign) — so
  it's consistent, not a regression. Worth a glyph anyway if a future pass
  wants full coverage (e.g. `index.html` structural pages could get `▪`).
- **Four dead CSS rules** ship unchanged from the design project's file:
  `.card .card-path`, `.btn-primary`/`.btn-primary:hover`,
  `.visually-hidden`, `.kb-main-wide` — defined in `assets/css/site.css`
  but referenced by no class in any `.js`/`.html` file. Harmless (no
  visual effect), but worth pruning or wiring up next time `site.css` is
  touched.
- **`.kb-results` has no CSS rule** (only singular `.kb-result` is
  styled) — pure DOM hook, no visual impact, pre-dates the redesign.
