---
type: source
title: Anthropic — "Effective context engineering for AI agents"
summary: The canonical engineering essay — context as a finite resource, and the four working techniques against context rot.
source: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
url: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
date: 2025-09-29
status: processed
tags: [anthropic, context-engineering, context-rot]
---

# Anthropic — "Effective context engineering for AI agents"

Anthropic engineering essay, 2025-09-29. The canonical treatment of context
engineering as an engineering discipline rather than prompt-writing craft.

Core frame: context is a **finite resource** whose usefulness degrades as the
window fills — the essay's term is "context rot." Against it, four techniques
that became the field's standard toolkit:

1. **Compaction** — summarize and replace older context rather than letting
   it accumulate.
2. **Note-taking / memory** — persist important information outside the
   window so it survives across sessions (the technique that
   [agent memory](../topics/agent-memory.md) systems and
   [context repos](../topics/context-repo.md) productize).
3. **Just-in-time retrieval** — fetch context when needed rather than
   front-loading it (the retrieval-side twin of
   [progressive disclosure](../topics/progressive-disclosure.md)).
4. **Sub-agents** — isolate context-heavy work in separate agents that return
   only conclusions.

It sits alongside Karpathy's June 2025 definition and LangChain's
write/select/compress/isolate taxonomy as one of the three framings this KB's
[context engineering](../topics/context-engineering.md) topic synthesizes.

Propagated to: [context-engineering](../topics/context-engineering.md),
[agent-memory](../topics/agent-memory.md),
[progressive-disclosure](../topics/progressive-disclosure.md).

## Key excerpts

- From the research notes: "context as finite resource ('context rot');
  compaction, note-taking/memory, just-in-time retrieval, sub-agents."
- Karpathy's adjacent framing (June 2025), for the record: context
  engineering is "the delicate art and science of filling the context window
  with just the right information."
