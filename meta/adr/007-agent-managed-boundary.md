# ADR 007 — The agent-managed boundary is `kb/`

Date: 2026-07-18 · Status: accepted (maintainer directive, interview Q9)

**Context.** The repo mixes agent-written knowledge (`kb/`) with
human-authored machinery and reference material (root files like `kb-card.md`
and `AGENTS.md`, plus `docs/`, `skills/`, the site). Agents need to know what
they may edit freely versus what they may only read and propose against.

**Decision.** Three tiers:

1. `kb/` is **agent-managed** — the workflows write there directly (within
   the existing propose-don't-delete conduct rules).
2. Everything outside `kb/` is **not agent-managed but IS in query scope** —
   query answers may draw on and cite `docs/`, `kb-card.md`, `AGENTS.md`,
   README, etc.
3. Lint and ingest **may propose** changes to non-kb content and structure,
   but applying them is a **governed process** (issue/PR for the owner, or
   explicit human approval in-session) — because non-kb content is assumed
   authoritative and less volatile than the KB.

**Consequences.** Query scope ≠ write scope; the skills state both. The
declared/inferred split on kb-card.md already follows this pattern (lint
writes only the marked inferred block). Site build scope is unchanged
(`kb/` + `kb-card.md`).
