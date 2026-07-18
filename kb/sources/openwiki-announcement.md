---
type: source
title: Brace Sproul — Introducing OpenWiki
summary: Launch of LangChain's agent-maintained wiki CLI (X Article, 2026-07-01), plus its OKF adoption and Brains follow-on.
source: https://github.com/langchain-ai/openwiki
url: https://github.com/langchain-ai/openwiki
date: 2026-07-01
status: processed
tags: [openwiki, langchain, announcement]
---

# Brace Sproul — Introducing OpenWiki

X Article by Brace Sproul (Head of Applied AI, LangChain), 2026-07-01, with
the repo at github.com/langchain-ai/openwiki (the repo was fetched during
research; the X post was reconstructed under the same egress caveat as the
other X threads, verbatim only where quoted).

The announcement covers: a CLI with two modes (code brain — repo docs into
`openwiki/`; personal brain — `~/.openwiki/wiki` from connectors including
repos, Gmail, Notion, Slack, web search, HN, and X); CI-maintained freshness
via a daily `openwiki --update` PR; both modes emitting Google
[OKF](../standards/open-knowledge-format.md) v0.1 bundles (adoption announced
separately on 2026-07-16, status 2077799633640919208); and construction on
LangChain's open deepagents harness. Follow-on release: OpenWiki Brains 0.1.0
(2026-07-10), "proactive memory" — agents build memories by fetching context
rather than waiting to be told
(https://www.langchain.com/blog/introducing-openwiki-brains-general-purpose-wiki-memory-for-agents).

Significance: reference OSS implementation of the agent-maintained wiki-as-KB
and the first major OKF producer.

Propagated to: [openwiki](../tools/openwiki.md),
[open-knowledge-format](../standards/open-knowledge-format.md),
[llm-wiki-pattern](../topics/llm-wiki-pattern.md),
[agent-memory](../topics/agent-memory.md).

## Key excerpts

- Companion tweet (verbatim): "Excited to release OpenWiki! OpenWiki is the
  easiest way to generate and maintain documentation in your codebase, built
  specifically for agents to consume. Get started with a single command:
  `openwiki --init`"
