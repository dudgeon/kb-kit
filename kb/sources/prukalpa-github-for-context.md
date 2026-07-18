---
type: source
title: Prukalpa Sankar — "The GitHub for Context Doesn't Exist Yet"
summary: The decoupling manifesto — agents are becoming disposable, context is not; every unit of context needs a profile.
source: https://contextandchaos.substack.com/p/the-github-for-context-doesnt-exist
url: https://contextandchaos.substack.com/p/the-github-for-context-doesnt-exist
date: 2026-07-16
status: processed
retrieval: secondary - reconstructed from search snippets and mirrors
tags: [prukalpa, decoupling, governance, kb-card]
---

# Prukalpa Sankar — "The GitHub for Context Doesn't Exist Yet"

Essay by Prukalpa Sankar (Atlan co-CEO, "Context & Chaos" Substack), announced
on X 2026-07-16. Retrieval caveat: x.com was egress-blocked during research;
the essay was reconstructed via search snippets and mirrors — treat framing as
faithful, exact wording as verbatim only where quoted below.

Opens with an AI Engineer World's Fair 2026 anecdote — building an agent took
~5 minutes; giving it business context "took forever" — and a company that
burned through five agent stacks in twelve months, each migration stranding
the context that made the agents useful. Prescribes a GitHub-like operating
layer for context: profiles per unit of context (owner, approvers,
maintainers, scope, provenance, declared dependencies), local vs company-wide
context kept distinct (marketing and finance can legitimately define the same
term differently), and domain experts encoding knowledge into shared skills in
one "company brain."

Propagated to: [context-repo](../topics/context-repo.md) (decoupling thesis),
[kb-discovery](../topics/kb-discovery.md) (her "profile for a unit of
context" is external validation of kb-card),
[agent-skills](../standards/agent-skills.md), [mem0](../tools/mem0.md).

## Key excerpts

- "The agent layer is becoming disposable, but a company's context is not —
  yet most tools still bind the two together."
- "Performance is intelligence times context, and the relationship is
  **multiplicative**."
- SWE parallel: git gave code diffs; industrial software also needed review,
  ownership, CI, dependency management, registries, observability. Today
  "**context has diffs**" but not the rest.
- The missing thing is an "operating layer treating context as durable
  infrastructure," not agent-specific configuration.
