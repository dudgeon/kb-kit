# ADR 001 — Google OKF v0.1 as format anchor, with two documented deviations

Date: 2026-07-18 · Status: accepted

## Context
The kit needed a format standard. Candidates: Karpathy's gist (deliberately
abstract, wikilinks), the maintainer's brainkit/duo conventions, Google OKF
v0.1 (published spec, minimal floor, growing adoption incl. OpenWiki).

## Decision
Anchor on OKF v0.1 (frontmatter with required `type`, md links, tolerant
consumers) with two deliberate deviations:
1. **Relative markdown links only** — OKF "recommends" bundle-root-absolute
   `/path.md`, which breaks GitHub web UI and Pages rendering. Relative links
   are spec-valid, render everywhere, and match brainkit/duo.
2. **`_index.md`/`_log.md`** instead of reserved `index.md`/`log.md` — see
   ADR 002.

## Consequences
Bundles are consumable by OKF tooling that follows the mandated tolerant
posture; strict conformance checkers may flag the underscore names. Both
deviations are documented in AGENTS.md and as demo `decision` pages in kb/.
