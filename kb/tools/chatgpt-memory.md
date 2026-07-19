---
type: tool
title: ChatGPT memory ("Dreaming")
summary: The largest deployed agent memory system — offline consolidation that updates memories; opaque and non-portable.
source: unverified
maker: OpenAI
url: unverified
tags: [chatgpt, memory, opaque, consolidation]
---

# ChatGPT memory ("Dreaming")

ChatGPT's memory system is the largest deployed agent memory system, and the
philosophical outlier of this survey. Its "Dreaming V3" release (2026-06-04)
performs **offline consolidation** — a background process that doesn't merely
append memories but *updates* them over time, revising what the system
believes about a user as new information arrives.

Technically, that consolidation step is sophisticated: it is the "compress"
operation of the context-engineering taxonomy (see
[context engineering](../topics/context-engineering.md)) running continuously
and invisibly. But the system is **opaque and non-portable**: users cannot
inspect the full store, diff a change, review a consolidation, or export their
memory to another vendor. The research notes call it "the philosophical
opposite of markdown context repos," and this KB uses it as the boundary case
that defines the category: every property a
[context repo](../topics/context-repo.md) has — readable, diffable, portable,
jointly ownable — Dreaming lacks by design.

The contrast with the rest of the memory field is stark:
[Letta](./letta.md) moved its memory substrate *into* git;
[Mem0](./mem0.md) sells portability across agent stacks; Dreaming binds
memory to one vendor's product. See
[agent memory](../topics/agent-memory.md) for why the survey's lasting
distinction is transparent-vs-opaque rather than memory-vs-KB.

Provenance note: no primary URL was captured in the research notes; details
here trace to the 2026-07-18 landscape survey and should be re-verified
against OpenAI's own documentation.
