---
type: source
title: Cerebras — "How We Built Our Knowledge Base"
summary: First-party account of an internal agent-queried company KB; the blog itself was not retrievable — details are secondhand.
source: https://www.cerebras.ai/blog/how-we-built-our-knowledge-base
url: https://www.cerebras.ai/blog/how-we-built-our-knowledge-base
date: 2026-07-16
status: processed
retrieval: failed - reconstructed from secondary coverage only
tags: [cerebras, company-kb, unverified]
---

# Cerebras — "How We Built Our Knowledge Base"

**Retrieval caveat, up front: the underlying blog post was not retrievable
during research** (egress-blocked, and only two days old at survey time,
2026-07-18). Everything on this page comes from the promotional X post and
secondary search coverage — treat every specific below as unconfirmed until
the post is re-fetched from an unrestricted network.

What is establishable: a corporate X post (2026-07-16) promoting a first-party
account of Cerebras's internal, agent-queried company knowledge base. Claimed:
employees query it **15,000+ times** (period unknown); the post drew ~1.1M
views (unverified). Authors credited: @hi_im_isaac_, @learnwdaniel,
@gaozenghao. Search context ties the implementation to the
[LLM-wiki pattern](../topics/llm-wiki-pattern.md) — hybrid SQLite FTS5 plus
local embeddings, exposed via CLI and [MCP](../standards/mcp.md) — but **the
techniques are unconfirmed**.

Why it earned a page despite the thin sourcing: it would be among the first
public first-party accounts of a company-scale
[context repo](../topics/context-repo.md) in production, and the claimed
search stack matches exactly what the largest practitioner in the Karpathy
gist comments reported adopting past a few hundred pages. If confirmed, it is
the scale datapoint this survey otherwise lacks.

**Follow-up action:** re-fetch the blog from an unrestricted network, replace
the secondhand claims here, and update the propagated pages.

## Key excerpts

- From the research notes (no verbatim blog text was available): "first-party
  account of an internal, agent-queried company KB; employees query it
  15,000+ times (period unknown)... techniques unconfirmed. Re-fetch from an
  unrestricted network later."
