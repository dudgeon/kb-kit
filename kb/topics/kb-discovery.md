---
type: topic
title: KB discovery and the kb-card gap
summary: No adopted standard describes a knowledge base the way a model card describes a model — the gap kb-kit's kb-card targets.
source: synthesized from linked sources, 2026-07-18
tags: [kb-card, discovery, model-cards, governance]
---

# KB discovery and the kb-card gap

How does an agent (or a team) find a knowledge base, and decide whether to
trust it? As of mid-2026, **no dedicated, widely adopted "KB card" standard
exists**. That is the open gap in an otherwise converging landscape — and the
one kb-kit's repo-root `kb-card.md` proposes to fill.

**Functional analogs, none sufficient:**
[OKF](../standards/open-knowledge-format.md) frontmatter plus its root
`index.md`; [SKILL.md](../standards/agent-skills.md) metadata;
the [MCP Registry](../standards/mcp.md)'s `server.json` (~9,650 servers as of
2026-05 — the nearest thing to a discovery standard for agent-accessible
knowledge sources); and [llms.txt](../standards/llms-txt.md) for websites.
Each describes something adjacent to, but not, a knowledge bundle.

**Mature precedents:** model cards (Mitchell et al. 2019), data cards, and
Hugging Face's YAML card metadata show the shape works; the EU AI Act codifies
card-like documentation. kb-kit's card follows the same split — a small
human-declared core (name, scope, owner) plus machine-inferred traits
(page/type census, freshness, link health) computed by lint.

**External validation:** Prukalpa Sankar's "The GitHub for Context Doesn't
Exist Yet" (2026-07-16) argues every "unit of context" needs a GitHub-like
profile — owner, approvers, maintainers, scope, provenance, declared
dependencies — and that the missing piece is an operating layer treating
context as durable infrastructure
([source](../sources/prukalpa-github-for-context.md)). Her "profile for a unit
of context" is essentially the kb-card, argued from the enterprise-governance
side.

Governance context: AGENTS.md and Skills moved under the Linux Foundation's
Agentic AI Foundation in Dec 2025; MCP has open governance. Whether
knowledge-bundle formats (OKF, llms.txt) — and any KB-card successor — follow
into neutral stewardship is an open question this page should track.
