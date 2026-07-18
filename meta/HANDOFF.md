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

> **Update 2026-07-18 (local agent):** tasks 1–3 and 6 are DONE — site
> browser-verified (all routes, search, dark mode, mobile, 404s; two site
> fixes landed: root index now links folder indexes, renderer skips
> comment-only HTML lines), lint run (kb-card inferred block populated),
> all three sources re-fetched and corrected (Cerebras stack claim was
> wrong in secondary coverage — see kb/_log.md), setup-skill removal list
> verified and its do-not-touch list extended. Still open: Pages
> deployment check after merge to main; tasks 4 (needs maintainer
> approval) and 5 (Obsidian, needs desktop app).

1. ~~**Browser-verify the site**~~ DONE (locally; re-check on the live
   Pages URL after merging to main).
2. ~~**Run the lint skill**~~ DONE.
3. ~~**Re-fetch the three blocked sources**~~ DONE.
4. **Scheduled mechanical-lint Action** — proposed to maintainer (OpenWiki's
   daily-PR pattern), NOT yet approved; maintainer left it "open question vs
   build" — ask before building.
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
  rebuild with `node scripts/build-index.mjs` after any kb/ change.
- The maintainer wants md links everywhere, NEVER wikilinks — including in
  docs and examples (code-fence any `[[...]]` you must show).
- Site pages must stay heavily commented; that's a feature, not noise.
