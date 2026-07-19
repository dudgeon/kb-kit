# ADR 011 — Surface voice: educational and descriptive, never salesy

Date: 2026-07-19 · Status: accepted (maintainer feedback, interview Q18–Q19)

**Context.** The maintainer flagged index.html as "too salesy … not
descriptive enough about how the kit works, what it is comprised of, which
standards/approaches/lineage it adheres to," and the KB home's flow-in
section as "descriptive instead of educational." They do not want to give
this feedback twice.

**Decision.**

1. **Voice rule for every user-facing surface** (index.html, the KB app
   copy, README): educational and descriptive. Explain how things work,
   what the kit is composed of, and which standards/approaches/lineage it
   follows (OKF, AGENTS.md, Agent Skills, the Karpathy loop, model cards).
   Concrete instructions with real links beat adjectives; no marketing
   superlatives.
2. **Each surface has a role.** index.html is the kit *explainer* (how it
   works, what's inside, lineage, how to adopt). The KB home is the
   *casual-use surface* — quick browsing and basic search — and says so,
   while naming the deeper paths (clone + query skill, pointing an agent at
   AGENTS.md, RAG/MCP over the repo contents).
3. **Currency is enforced, not hoped for.** AGENTS.md instructs agents:
   when the kit's machinery, composition, or conventions change, check
   index.html (and the README) still describe reality, in the same change —
   the pattern-log entry is the reminder hook.

**Consequences.** The index.html rewrite is calibrated first through a
voice playground (`meta/study-about-voice/`, maintainer picks a direction).
Copy reviews become part of machinery changes, not an afterthought.
