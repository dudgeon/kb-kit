# ADR 010 — pattern-log.md: a machinery ledger that makes forks upgradeable

Date: 2026-07-18 · Status: accepted (maintainer directive, interview Q14);
the upgrade skill itself is QUEUED, not yet built

**Context.** Forks customize the kit machinery (site, skills, scripts,
schema) *and* fill `kb/` with their own content. When upstream kb-kit later
improves, a fork can't just merge or rebase: content added post-fork would
be ruined and customizations squashed. Git history alone doesn't distinguish
"deliberate fork customization" from "drift"; a future upgrade skill needs a
semantic ledger on both sides to reason over.

**Decision.**

1. **Root `pattern-log.md`, mirroring `kb/_log.md`'s shape** (`## YYYY-MM-DD`
   newest first) but scoped to the *pattern* — machinery outside `kb/`
   (site, skills, scripts, workflows, AGENTS.md, kb-card spec) plus
   structural conventions (new reserved folders, template semantics).
2. **Provenance-tagged entries.** In upstream kb-kit every entry is
   `upstream | …`. Forks keep upstream entries untouched (append-friendly),
   add their own as `fork | …`, and get a `fork-point` anchor entry written
   by the setup skill (upstream repo + commit SHA + date).
3. **AGENTS.md requires the entry.** Any agent changing machinery appends a
   pattern-log entry in the same change — same discipline as `kb/_log.md`
   for content. Lint flags machinery drift (changes with no entry).
4. **The future upgrade skill** (queued; `skills/upgrade/`) will: fetch
   upstream's `pattern-log.md`, diff entries against the fork's copy since
   the fork-point, cross-reference the fork's own `fork |` entries for
   collisions, and **recommend** — with judgment, per change, never a blind
   merge — which upstream upgrades to adopt, adapt, or skip. It proposes
   patches; the fork owner decides.

**Consequences.** The ledger costs one bullet per machinery change and
makes fork↔upstream reasoning tractable for an agent with no shared git
history. Upstream must now practice the discipline it asks of forks —
pattern-log.md is seeded with the kit's machinery milestones to date and
maintained from here on.
