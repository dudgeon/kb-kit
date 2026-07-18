---
type: tool
title: Mem0 / OpenMemory
summary: Memory-as-a-service API plus a local-first CLI that ports one memory across agent stacks.
source: https://mem0.ai/
maker: Mem0
url: https://mem0.ai/
tags: [mem0, openmemory, memory, portability]
---

# Mem0 / OpenMemory

Mem0 offers agent memory as a service: an API for storing and retrieving what
an agent should remember, so memory lives outside any single agent's context
window or vendor. Its OpenMemory offering extends this local-first: a CLI that
ports **one memory across Claude Code, Codex, and OpenCode**.

That portability is the interesting move for this survey. It is the
decoupling thesis — agents disposable, context durable (see
[context repo](../topics/context-repo.md)) — applied to personal agent memory:
if you can carry the same memory across three different coding agents, the
memory is the durable asset and the agents are interchangeable front-ends.
Prukalpa's stranded-context anecdote (five agent stacks in twelve months,
[source](../sources/prukalpa-github-for-context.md)) is exactly the failure
mode this design prevents.

Mem0 also publishes the
["State of AI Agent Memory 2026" report](../sources/state-of-agent-memory-2026.md)
(not yet ingested), positioning itself as chronicler of the category it
competes in.

Placement in the landscape: Mem0 sits between
[Letta](./letta.md)'s git-repository pivot (fully transparent substrate) and
[ChatGPT memory](./chatgpt-memory.md)'s opaque consolidation — a service, but
one built around the premise that memory should move with the user. See
[agent memory](../topics/agent-memory.md) for the full convergence picture.
