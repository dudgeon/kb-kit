---
type: source
title: Karpathy — "LLM Wiki" gist
summary: The April 2026 idea file defining the agent-maintained compounding markdown wiki — three layers, three operations.
source: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
url: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
date: 2026-04
status: processed
tags: [karpathy, llm-wiki, gist]
---

# Karpathy — "LLM Wiki" gist

An "idea file" (`llm-wiki.md`, shared April 2026; ~5k+ stars and 40+ comments
as of 2026-07) meant to be pasted to your own agent. Core move: replace
per-query RAG with a persistent wiki the LLM builds and maintains. Three
layers (raw sources / wiki / schema), three operations (ingest / query /
lint), a flat `index.md` as the catalog, `log.md` as append-only history,
`[[wikilinks]]` as graph edges, Obsidian and git as tooling. Deliberately
abstract — "It describes the idea, not a specific implementation." The comment
threads are as valuable as the gist: production-scale reports on drift, lint,
and search scaling.

Propagated to: [llm-wiki-pattern](../topics/llm-wiki-pattern.md),
[context-repo](../topics/context-repo.md),
[open-knowledge-format](../standards/open-knowledge-format.md) (which
formalizes it), [obsidian](../tools/obsidian.md).

## Key excerpts

- "the LLM **incrementally builds and maintains a persistent wiki** — a
  structured, interlinked collection of markdown files that sits between you
  and the raw sources." A "persistent, compounding artifact."
- Layer 1, raw sources: "These are immutable — the LLM reads from them but
  never modifies them. This is your source of truth."
- Layer 2, the wiki: "The LLM owns this layer entirely... You read it; the
  LLM writes it."
- Layer 3, the schema: "a document (e.g. CLAUDE.md for Claude Code or
  AGENTS.md for Codex) that tells the LLM how the wiki is structured, what the
  conventions are, and what workflows to follow."
- Ingest: "a single source might touch 10-15 wiki pages."
- "The tedious part of maintaining a knowledge base is not the reading or the
  thinking — it's the bookkeeping... LLMs don't get bored, don't forget to
  update a cross-reference, and can touch 15 files in one pass."
- "your explorations compound in the knowledge base."
- Comment, phoebe22222 (~4,000-concept prod wiki): "The schema file is
  everything"; drift is the top failure mode — "the lint pass is *not*
  optional."
