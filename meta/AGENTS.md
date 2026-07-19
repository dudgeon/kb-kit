# meta/AGENTS.md — building and changing the kit itself

Read this when working **on kb-kit** — its machinery, docs, site, skills, or
conventions — rather than using the KB. (Using the KB: root
[AGENTS.md](../AGENTS.md), which always wins inside `kb/`.)
`meta/CLAUDE.md` is a shim to this file, mirroring the root arrangement.

## The two instruction layers

- **Root [AGENTS.md](../AGENTS.md)** is for *users of the kit*: descriptive
  about the project, how to fork, how to live post-fork, the KB conventions
  and workflows. The setup skill tailors it during onboarding — it must
  always describe the actual KB it sits in.
- **This file** is for *builders of the kit*: process, infrastructure,
  standing feedback (like writing tone), and where everything lives. It is
  upstream-only residue — `meta/` is deleted before release and is never
  part of a forked KB.

Rule of thumb: if a future fork owner needs it, it belongs in root
AGENTS.md or `docs/`; if only a kit developer needs it, it belongs here.

## The meta rule

Everything outside `meta/` must make sense in a fresh fork with the demo
content deleted. Everything about *building* the kit (plans, research,
ADRs, interview logs, studies, this file) lives in `meta/`. Never link to
`meta/` from user-facing files except the pointer at the bottom of root
AGENTS.md.

## Document map (orient here before changing anything)

| Doc | Role |
| --- | --- |
| [PLAN.md](./PLAN.md) | The PRD: product principles (standing), deliverables, phases |
| [adr/](./adr) | One ADR per non-obvious design decision (`NNN-short-title.md`: context, decision, consequences). Write one whenever you make such a decision |
| [INTERVIEW-LOG.md](./INTERVIEW-LOG.md) | Every maintainer Q&A, verbatim-ish. Decisions there are LOCKED — don't re-ask |
| [HANDOFF.md](./HANDOFF.md) | Session-to-session state: what's done/verified, what's open, gotchas. Update it when you finish or park work |
| [kb-card-interview-prep.md](./kb-card-interview-prep.md) | Queued maintainer interview (one question at a time when they're available) |
| [study-about-voice/](./study-about-voice/index.html) | Decision playground pattern: when direction is ambiguous, build a small page of concrete options, let the maintainer pick (`window.__getFeedback().readable`), then implement |
| [research/](./research) | Raw research notes behind the demo KB |
| [../pattern-log.md](../pattern-log.md) | NOT meta — the user-facing machinery ledger. Every machinery change appends an entry (upstream discipline enables the future upgrade skill) |

Pending work lives in HANDOFF.md's "still open" note (currently: the
upgrade skill, the kb-card interview, the index.html rewrite once the voice
playground has picks).

## Writing tone (standing maintainer feedback — Q18; do not drift)

Every user-facing surface — `index.html`, the KB app copy, README — is
**educational and descriptive, never salesy**:

- Explain how things work, what the kit is composed of, and which
  standards/approaches/lineage it adheres to (OKF, AGENTS.md, Agent
  Skills, the Karpathy ingest/query/lint loop, model cards → kb-card).
  Plain statements and real links beat adjectives; no superlatives.
- Surface roles: `index.html` = the kit *explainer*; the KB home = the
  *casual browse/search surface* that names the deeper paths (clone +
  query, agent + AGENTS.md, RAG/MCP).
- **Currency is part of every change**: when machinery, composition, or
  conventions change, verify `index.html` and the README still describe
  reality — same commit as the change and its pattern-log entry.

## Load-bearing decisions (see adr/ and INTERVIEW-LOG.md; don't casually reverse)

- OKF v0.1 anchor, two deviations: relative-md-links-only;
  `_index.md`/`_log.md` (ADR 001/002).
- AGENTS.md canonical, CLAUDE.md shim — at BOTH layers (ADR 003, Q21).
- Site is NOT an SSG; one client-side shell renders raw markdown (ADR 004).
- kb-card: human-declared core + lint-computed inferred block (ADR 005);
  it is the discovery interface for the org hub/crawler trajectory, with
  `external_sources` (ADR 013).
- `meta/` separation (ADR 006). Agent-managed boundary: agents write `kb/`;
  non-kb is queryable but propose-only (ADR 007).
- Pages deploys FROM THE BRANCH, `.nojekyll` load-bearing — firm (ADR 008).
- inbox = unprocessed queue; ingest MOVES originals to `kb/sources/raw/`;
  three intake channels: session, inbox, issues (ADR 009/012).
- Voice: educational, never salesy (ADR 011, above).
- pattern-log.md machinery ledger → future upgrade skill (ADR 010).
- **Local-agent-only** (Q15): no server-side/scheduled/headless agents; CI
  runs deterministic scripts only, no model calls.
- Licensing: archiving freely available content is fine (fair use, Q13) —
  don't stop to ask.

## Build infrastructure

- `scripts/build-index.mjs` — walks ALL repo md + the two HTML pages into
  `assets/data/*.json`. **Deterministic on purpose**: `modified` = last git
  commit date, `generated_at` = newest content date. Never reintroduce
  wall-clock time or mtimes — the CI backstop would commit churn on every
  push.
- `scripts/lint-kb.mjs` — mechanical lint (errors fail CI; dangling links
  stay warnings by design). Run it after structural changes.
- `.github/workflows/build-index.yml` — CI only: lint + rebuild-and-commit
  the JSON if drifted. It must never deploy Pages (ADR 008).
- `.claude/launch.json` — `kb-site` preview server (python http.server on
  8123) for browser verification.
- Norms: browser-verify site changes before committing (a real render, not
  just the build); evidence problems lead your summary, never trail it
  (standing rule from the 2026-07-18 incident); rebuild + commit the JSON
  with any content change; targeted `git add`s.

## Working agreements

- The maintainer (a PM) mostly replies from a phone: **one question at a
  time**, short. Use AskUserQuestion for multiple-choice decisions (their
  explicit preference, Q3) — with enough context to refresh their memory.
- Log every Q&A in INTERVIEW-LOG.md; non-obvious decisions get ADRs; every
  machinery change gets a pattern-log entry; keep HANDOFF.md current at
  session end.
- Queued directives ("later") get recorded immediately (task + log), built
  when small and unambiguous, asked about otherwise.
