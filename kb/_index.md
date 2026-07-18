---
okf_version: "0.1"
type: index
title: Knowledge base — index
---

# Knowledge base

A survey of the context-management and context-repo landscape (mid-2026).
What this KB is and who owns it: [kb-card.md](../kb-card.md). How to work
here: [AGENTS.md](../AGENTS.md).

<!-- duo:listing -->

## Start here

- [The context repo](./topics/context-repo.md) - the idea this whole KB (and kit) is about: durable, versioned knowledge shared by humans and agents.
- [KB discovery and the kb-card gap](./topics/kb-discovery.md) - the open gap kb-kit targets.
- [Open questions](./topics/open-questions.md) - the frontier: multiplayer governance, ossified authority, volatile sources.

## Topics

- [The context repo](./topics/context-repo.md) - the central concept and the decoupling thesis (agents disposable, context durable).
- [Context engineering](./topics/context-engineering.md) - the discipline: Karpathy's framing, Anthropic's techniques, LangChain's write/select/compress/isolate.
- [The LLM-wiki pattern](./topics/llm-wiki-pattern.md) - Karpathy's three layers, the ingest/query/lint loop, drift as the failure mode.
- [Progressive disclosure](./topics/progressive-disclosure.md) - the token-frugal mechanism shared across skills, OKF, CLAUDE.md, and MCP.
- [Agent memory vs. knowledge bases](./topics/agent-memory.md) - memory systems and KBs merging into context repos; ChatGPT as the opaque outlier.
- [KB discovery and the kb-card gap](./topics/kb-discovery.md) - no adopted KB-card standard; model-card precedents; what kb-kit proposes.
- [Open questions](./topics/open-questions.md) - who lints in multiplayer mode, how authority ossifies, and how repos coexist with Notion/Docs/Slack.

## Standards

- [Open Knowledge Format (OKF)](./standards/open-knowledge-format.md) - Google's v0.1 knowledge-bundle spec; this KB's format anchor.
- [AGENTS.md](./standards/agents-md.md) - the de facto repo-root agent instruction file; ~30 tools, 60k+ repos.
- [Agent Skills (SKILL.md)](./standards/agent-skills.md) - packaged capabilities loaded via progressive disclosure; ~40 products.
- [llms.txt](./standards/llms-txt.md) - root markdown site index for LLMs; growing supply, lagging crawler demand.
- [MCP — Resources and the Registry](./standards/mcp.md) - context delivery over protocol, and the nearest existing discovery standard.
- [CLAUDE.md](./standards/claude-md.md) - Anthropic's layered memory hierarchy; coexists with AGENTS.md.

## Tools & systems

- [OpenWiki](./tools/openwiki.md) - LangChain's agent-maintained wiki CLI; first major OKF producer.
- [Letta](./tools/letta.md) - MemGPT lineage; rebuilt around git-based context repositories in Feb 2026.
- [Mem0 / OpenMemory](./tools/mem0.md) - memory-as-a-service; one memory ported across agent stacks.
- [Obsidian](./tools/obsidian.md) - the vault-as-agent-KB pattern; human graph UX over agent-native markdown.
- [ChatGPT memory](./tools/chatgpt-memory.md) - the largest deployed memory system; opaque and non-portable.
- [brainkit](./tools/brainkit.md) - a forkable second-brain kit whose knowledge folder is a valid OKF vault.
- [duo](./tools/duo.md) - macOS human+agent workspace defining the OKF-aligned vault flavor this kit borrows from.

## Sources

- [Karpathy — "LLM Wiki" gist](./sources/karpathy-llm-wiki-gist.md) - the April 2026 idea file the pattern traces to.
- [Google OKF SPEC.md v0.1](./sources/okf-spec.md) - the knowledge-bundle spec, 2026-06-12.
- [Prukalpa — "The GitHub for Context Doesn't Exist Yet"](./sources/prukalpa-github-for-context.md) - the decoupling manifesto, 2026-07-16.
- [Introducing OpenWiki](./sources/openwiki-announcement.md) - Brace Sproul's launch announcement, 2026-07-01.
- [Cerebras — "How We Built Our Knowledge Base"](./sources/cerebras-kb-blog.md) - company-scale KB account; blog not retrievable, details secondhand.
- [Anthropic — "Effective context engineering"](./sources/anthropic-effective-context-engineering.md) - context rot and the four techniques, 2025-09-29.

## Decisions

- [Relative markdown links only](./decisions/relative-markdown-links.md) - why not wikilinks, why not OKF's absolute form.
- [_index.md and _log.md](./decisions/underscore-index-files.md) - why the underscore deviation from OKF's reserved names.
- [Minimal typing, grown via the loop](./decisions/minimal-typing.md) - types earn their way in; demo types are setup-removable.

## Templates

- [templates/](./templates/_index.md) - entity type definitions for this KB.
