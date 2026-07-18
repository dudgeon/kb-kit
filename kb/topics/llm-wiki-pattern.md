---
type: topic
title: The LLM-wiki pattern
summary: Karpathy's three-layer, agent-maintained markdown wiki — ingest/query/lint as the loop, drift as the failure mode.
source: synthesized from linked sources, 2026-07-18
tags: [llm-wiki, karpathy, ingest, lint, drift]
---

# The LLM-wiki pattern

Karpathy's April 2026 gist described the pattern this kit implements: instead
of RAG retrieval at query time, "the LLM incrementally builds and maintains a
persistent wiki" — a "persistent, compounding artifact" sitting between you and
the raw sources ([source](../sources/karpathy-llm-wiki-gist.md)).

**Three layers**: (1) raw sources — immutable, "the LLM reads from them but
never modifies them"; (2) the wiki — LLM-generated markdown, "you read it; the
LLM writes it"; (3) the schema — a document (CLAUDE.md or AGENTS.md) telling
the LLM how the wiki is structured and which workflows to follow. This repo's
`AGENTS.md` plays the schema role.

**Three operations**: **ingest** (one source may touch 10–15 wiki pages),
**query** (read the index first, answer with citations, file reusable answers
back), and **lint** (periodic health check for contradictions, stale claims,
orphans, gaps). A flat `index.md` substitutes for RAG infrastructure to roughly
100 sources / hundreds of pages.

**Drift is the failure mode.** The most substantial practitioner comment
(phoebe22222, running a ~4,000-concept production infra-ops wiki) reported that
silent staleness from missed cross-reference updates is the top failure —
"the lint pass is *not* optional" — and that past a few hundred pages a flat
index gives way to hybrid SQLite FTS5 + embeddings search. Other comment
threads converged on verification-status metadata, provenance headers, and
git-backed review gates.

Lineage and neighbors: the gist claims Memex ancestry (Vannevar Bush, 1945);
Google's [OKF](../standards/open-knowledge-format.md) explicitly positions
itself as this pattern "specified"; [OpenWiki](../tools/openwiki.md) and
[brainkit](../tools/brainkit.md) are implementations. The gist prescribes
`[[wikilinks]]` and no directory tree — this kit deliberately deviates on both
(see [relative markdown links](../decisions/relative-markdown-links.md)).
