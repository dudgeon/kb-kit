# ADR 014 — Two instruction layers, same shim pattern at both

Date: 2026-07-19 · Status: accepted (maintainer directive, interview Q21)

**Context.** Root AGENTS.md had accreted kit-development guidance (writing
tone, explainer-currency rules) alongside its real job — telling a KB's
users and their agents how to work. Meanwhile the build-layer guidance
lived only in meta/CLAUDE.md, breaking the AGENTS-canonical/CLAUDE-shim
architecture (Q2) at that layer.

**Decision.** Two audiences, two files, one pattern:

1. **Root AGENTS.md — for users of the kit.** Descriptive about the
   project; how to fork and how to live post-fork; the KB's conventions,
   boundary, workflows, card, and pattern-log discipline. The setup skill
   **tailors it during onboarding** so it always describes the actual KB it
   sits in (onboarding isn't done until AGENTS.md tells the truth). Only a
   one-line voice floor stays in its Conduct list.
2. **meta/AGENTS.md — for builders of the kit** (new; meta/CLAUDE.md is now
   its shim, mirroring the root arrangement). Orients an agent to the build
   docs and processes: PLAN.md as the PRD, ADRs, the interview log (locked
   decisions), HANDOFF.md (state + pending todos), decision playgrounds,
   pattern-log discipline, build infrastructure (deterministic build-index,
   lint-kb, CI, preview), working agreements, and standing feedback —
   including the full writing-tone rule (Q18), which moved here from root.

Rule of thumb recorded in both places: if a future fork owner needs it →
root AGENTS.md or docs/; if only a kit developer needs it → meta/.

**Consequences.** Root AGENTS.md gets shorter and fork-focused; agents
working on the kit have one orientation document instead of archaeology;
meta/ remains fully deletable pre-release without loss to forks.
