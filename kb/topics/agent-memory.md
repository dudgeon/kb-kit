---
type: topic
title: Agent memory vs. knowledge bases
summary: Memory systems and KBs are merging into context repos; ChatGPT's opaque memory is the philosophical outlier.
source: synthesized from linked sources, 2026-07-18
tags: [memory, letta, mem0, convergence]
---

# Agent memory vs. knowledge bases

Agent memory systems (what an agent remembers across sessions) and knowledge
bases (curated, shared knowledge) started as separate product categories. The
mid-2026 signal is that they are merging — into
[context repos](./context-repo.md).

The clearest evidence is **[Letta](../tools/letta.md)** (the MemGPT lineage):
after pioneering OS-inspired self-editing memory, it rebuilt in Feb 2026 around
git-based "context repositories." When the flagship memory company adopts the
files-in-git substrate, memory and KB have effectively converged.
**[Mem0](../tools/mem0.md)** points the same way from the portability angle:
its OpenMemory CLI carries one memory across Claude Code, Codex, and OpenCode —
memory as a durable asset independent of any one agent, which is the decoupling
thesis (see [context repo](./context-repo.md)) applied to personal memory.
**[OpenWiki Brains](../tools/openwiki.md)** (2026-07-10) adds the proactive
variant: agents that build memories by fetching context rather than waiting to
be told.

The outlier is **[ChatGPT memory](../tools/chatgpt-memory.md)**. "Dreaming V3"
(2026-06-04) does offline consolidation that *updates* memories over time, and
it is the largest deployed memory system — but it is opaque and non-portable:
the philosophical opposite of a markdown context repo. You cannot `cat` it,
diff it, review it, or take it to another vendor.

The distinction that survives the merge is not memory-vs-KB but
**transparent-vs-opaque**: whether the knowledge substrate is inspectable and
portable. Anthropic's context-engineering essay lists note-taking/memory as one
of four core techniques
([source](../sources/anthropic-effective-context-engineering.md)); the open
question this KB tracks is which substrate that note-taking lands in.
