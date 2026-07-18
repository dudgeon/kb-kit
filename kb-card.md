---
type: kb-card
kb_card_version: "0.1"
name: kb-kit demo knowledge base
description: A survey of the context-management and context-repo landscape (mid-2026), shipped as the working demo content of the kb-kit starter kit.
scope: Standards, tools, patterns, and ideas for giving AI agents and humans a shared, versioned knowledge substrate. Out of scope — general AI news, model benchmarks, anything not about context/knowledge management.
owner: kb-kit maintainers
audience: [product managers, agent builders, knowledge engineers]
topics: [context-engineering, knowledge-bases, agents, okf, agents-md, skills, mcp, memory]
access: public
license: MIT
contact: GitHub issues on this repository
entry_points:
  bundle: kb/_index.md
  site: https://dudgeon.github.io/kb-kit/knowledge-base.html
  agents: AGENTS.md
established: "2026-07-18"
---

# kb-card — kb-kit demo knowledge base

> This card describes the **demo KB** that ships with kb-kit so the site,
> search, and skills have something real to work on. When you fork the kit,
> the [setup skill](./skills/setup/SKILL.md) replaces this card with yours.
> Card format: [docs/kb-card-spec.md](./docs/kb-card-spec.md).

## What this is

A curated map of how teams give agents durable context in 2026: the standards
(AGENTS.md, Agent Skills, OKF, llms.txt, MCP), the tools (Letta, Mem0,
Obsidian-as-vault, Claude Code memory), and the ideas (context engineering,
progressive disclosure, the LLM-wiki pattern) — with sources.

## What's deliberately out of scope

Model capabilities and benchmarks, prompt-engineering tips, vendor news that
doesn't change how context repos are built.

## How to contribute

Open an issue or PR, or point your agent at [AGENTS.md](./AGENTS.md) and use
the ingest skill. Every page's site view has "edit" and "open issue" buttons.

## Caveats

This landscape moves fast; pages carry `source` provenance and dates — trust
the dates, not the tense of the prose.

<!-- BEGIN kb-card:inferred -->
_Not yet linted. Run the [lint skill](./skills/lint/SKILL.md) to populate
inferred traits (page/type census, link health, freshness, taxonomy grades)._
<!-- END kb-card:inferred -->
