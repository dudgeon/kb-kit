# meta/CLAUDE.md — building and maintaining kb-kit itself

Read this only when working **on the kit** (structure, site, skills, docs,
marketing page) rather than using the KB. User-facing conventions are in the
root [AGENTS.md](../AGENTS.md) and always win inside `kb/`.

## The meta/ rule

Everything outside `meta/` is **for future users of the kit** — it must make
sense in a fresh fork with the demo content deleted. Everything about
*building* the kit (plans, research, ADRs, interview logs, this file) lives in
`meta/`. When you make a non-obvious design decision, add an ADR to
`meta/adr/` (`NNN-short-title.md`: context, decision, consequences).

## Load-bearing decisions (do not casually reverse; see meta/adr/ and meta/INTERVIEW-LOG.md)

- Google OKF v0.1 is the format anchor, with two documented deviations:
  relative-md-links-only, and `_index.md`/`_log.md` (index-sorts-first;
  matches Duo).
- Typing starts minimal and grows via ingestion/lint. Demo types are
  catalogued in `skills/setup/` so setup can remove them cleanly.
- AGENTS.md is canonical; CLAUDE.md files are shims. Skills are agent-agnostic
  (`skills/<name>/SKILL.md`), mirrored into `.claude/skills/` via symlinks.
- The site is NOT an SSG: no per-md HTML twins. One template renders any KB
  page client-side; the Action only builds JSON (manifest + search index).
- Site HTML/JS/CSS must stay heavily commented and agent-friendly — forks
  customize it with their own agents.
- kb-card.md: small human-declared core; inferred traits computed by lint
  between `<!-- kb-card:inferred -->` markers.
- License: MIT (corporate-friendly, attribution).

## Working agreements

- The maintainer (a PM) mostly replies from a phone: ask questions one at a
  time; keep them short. Log every Q&A in `meta/INTERVIEW-LOG.md`.
- A parallel agent may be doing similar work on `main` — check for its logs
  and compare notes before large structural changes.
- `meta/` gets deleted (or archived) before the kit is announced; never link
  to `meta/` from user-facing files except the CLAUDE.md pointer.
