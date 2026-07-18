---
type: source
title: Cerebras — "How We Built Our Knowledge Base"
summary: First-party account of a company-scale KB queried 15,000+ times a day — Postgres-everything retrieval (pgvector + FTS + RRF), LLM distillation of Slack, MCP tools.
source: https://www.cerebras.ai/blog/how-we-built-our-knowledge-base
url: https://www.cerebras.ai/blog/how-we-built-our-knowledge-base
date: 2026-07-15
status: processed
retrieval: primary - full article fetched and read 2026-07-18
tags: [cerebras, company-kb, retrieval, slack]
---

# Cerebras — "How We Built Our Knowledge Base"

Blog post (2026-07-15) by Isaac Tai, Daniel Kim, and Mike Gao. First-party
account of Cerebras Knowledge, an internal KB launched ~3 months earlier and
queried **more than 15,000 times per day** by "humans, automations and
agents." An earlier version of this page was reconstructed from secondary
coverage while the blog was unreachable; the article has since been read in
full and the secondhand claims corrected (notably: the stack is
**Postgres-everything, not SQLite FTS5** as secondary coverage implied).

Design thesis: **meet information where it lives** rather than forcing a
single source of truth — "Information is generated wherever it is convenient
and ergonomic" (Slack threads, docs, code, Jira), so the system extracts from
each platform instead of changing behavior. This is a *retrieval* architecture
over live sources, *not* an agent-maintained wiki — a useful contrast with the
[LLM-wiki pattern](../topics/llm-wiki-pattern.md), whose Layer 1 (immutable
raw sources) is the only layer Cerebras indexes.

## Architecture (as stated in the article)

- **One Postgres table** holds embeddings (pgvector, 3,072-dim, HNSW),
  raw summaries, and metadata for every source; one connector per source;
  teams add custom sources via plugin scripts in PRs.
- **Hybrid retrieval, fused**: full-text (Postgres GIN) for exact tokens,
  embeddings for paraphrase, IDF to beat filler, age decay ("Slack answers
  expire"). Lists fused with reciprocal rank fusion (k=60), then an LLM
  reranker scores the top candidates; winners are re-expanded with
  neighboring context.
- **Slack is the flagship source**: Socket Mode bot, whole-thread upserts,
  then LLM **distillation** of each thread into a structured artifact
  (question / summary / resolution / systems / code refs) that is embedded
  instead of the raw transcript — "accuracy increased significantly when the
  thread was normalized." **Bursting** additionally embeds high-signal
  consecutive-message runs (IDF ≥ 4.0, ≥ 200 chars, or reactions).
- **Code**: CocoIndex with language-aware recursive chunking;
  incremental re-embedding per commit.
- **Query side**: planner LLM → parallel tool fan-out (search, search_slack,
  search_code, recent_prs, who_knows) → synthesis with citations. The
  [MCP](../standards/mcp.md) integration exposes the retrieval primitives as
  narrow, "as LLM-free as possible" tools and lets the client agent (e.g.
  Claude Code) do the orchestration.
- **Projects** scope search to a team's channels/repos/docs — "search
  everything everywhere" stopped being useful as the corpus grew.

Propagated to: [context-repo](../topics/context-repo.md) (the scale
datapoint), [open-questions](../topics/open-questions.md) (their thread
distillation is a working answer to the "Slack is the hard case" question).

## Key excerpts

- "Employees ask our internal knowledge base more than 15,000 questions every
  day."
- "The dream of a single source of truth, of course, rarely works in
  practice."
- "every source, from Slack threads to netlists, lands in the same embeddings
  table."
- "No single scorer is trusted on its own."
- "the knowledge base works because it meets people where the information
  already lives, instead of forcing everything into one rigid system."
