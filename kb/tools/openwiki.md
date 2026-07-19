---
type: tool
title: OpenWiki
summary: LangChain's CLI for agent-maintained wikis — repo docs or a personal brain, emitted as OKF bundles, kept fresh by CI.
source: https://github.com/langchain-ai/openwiki
maker: LangChain (Brace Sproul, Head of Applied AI)
url: https://github.com/langchain-ai/openwiki
tags: [openwiki, langchain, okf, wiki]
---

# OpenWiki

OpenWiki (released 2026-07-01) is the reference open-source implementation of
the agent-maintained wiki-as-KB, and the first major producer of
[Open Knowledge Format](../standards/open-knowledge-format.md) bundles. The
launch pitch: "the easiest way to generate and maintain documentation in your
codebase, built specifically for agents to consume. Get started with a single
command: `openwiki --init`."

Two modes: **code brain** — repo documentation generated into an `openwiki/`
directory — and **personal brain** — a wiki at `~/.openwiki/wiki` fed by
connectors (repos, Gmail, Notion, Slack, web search, Hacker News, X). Both
modes emit OKF v0.1 bundles (frontmatter `type`, reserved `index.md`/`log.md`,
root `okf_version`, markdown links); OKF adoption was announced 2026-07-16.
It is built on LangChain's open deepagents harness.

The distinctive operational move is **CI-maintained freshness**: a daily
`openwiki --update` run (GitHub Actions or similar) opens a PR with doc
updates — automated defense against drift, the top failure mode of the
[LLM-wiki pattern](../topics/llm-wiki-pattern.md), with the git PR as the
human review gate.

Follow-on: **OpenWiki Brains 0.1.0** (2026-07-10), "proactive memory" —
agents build memories by fetching context rather than waiting to be told,
placing OpenWiki in the memory-KB convergence traced in
[agent memory](../topics/agent-memory.md).

Announcement excerpts:
[openwiki-announcement](../sources/openwiki-announcement.md).
