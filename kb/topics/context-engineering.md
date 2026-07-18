---
type: topic
title: Context engineering
summary: The discipline of filling the context window with the right information — the frame that displaced prompt engineering.
source: synthesized from linked sources, 2026-07-18
tags: [context-engineering, discipline, terminology]
---

# Context engineering

Context engineering is the umbrella discipline this KB's whole subject sits
under. Karpathy's June 2025 framing named it: "the delicate art and science of
filling the context window with just the right information" — and the term
displaced "prompt engineering" as the field's umbrella vocabulary.

Two canonical treatments:

- **Anthropic, "Effective context engineering for AI agents" (2025-09-29)** —
  treats context as a finite resource that degrades as it fills ("context
  rot"), and catalogs the working techniques: compaction, note-taking/memory,
  just-in-time retrieval, and sub-agents
  ([source](../sources/anthropic-effective-context-engineering.md)).
- **LangChain** — the claim that "most agent failures are context failures,"
  and Lance Martin's **write / select / compress / isolate** taxonomy, which
  became the standard vocabulary for the four things you can do with context.

The connection to this KB: context repos are the *write* and *select* halves
made durable. A [context repo](./context-repo.md) is where an agent writes
distilled knowledge so future selection is cheap; the
[LLM-wiki pattern](./llm-wiki-pattern.md) is the maintenance loop; and
[progressive disclosure](./progressive-disclosure.md) is the shared mechanism
by which every major standard keeps selection token-frugal. The Anthropic
essay's "note-taking/memory" technique is exactly what
[agent memory](./agent-memory.md) systems productize.

One research caution worth keeping: verbose boilerplate context can perform
*worse* than none. Context files must be concise and contain only what the
agent cannot infer — a finding that motivates this kit's one-screen index rule
and minimal frontmatter floor (see
[minimal typing](../decisions/minimal-typing.md)).
