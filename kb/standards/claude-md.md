---
type: standard
title: CLAUDE.md and the Claude Code memory hierarchy
summary: Anthropic's layered instruction system — enterprise/project/personal files, imports, and agent-written auto memory.
source: https://code.claude.com/docs/en/memory
steward: Anthropic
status_note: product convention (Claude Code), not an open spec; coexists with AGENTS.md
url: https://code.claude.com/docs/en/memory
tags: [claude-md, memory-hierarchy, anthropic]
---

# CLAUDE.md and the Claude Code memory hierarchy

CLAUDE.md is Anthropic's instruction-file convention for Claude Code, and it
is more layered than [AGENTS.md](./agents-md.md): enterprise, project, and
personal CLAUDE.md files are discovered up the directory tree and can import
other files. Alongside the human-written layer sits **auto memory** — an
agent-written MEMORY.md whose first 200 lines / 25KB are auto-loaded.

The documented best practice is telling: keep CLAUDE.md to ~80–120 high-signal
lines, version-controlled. The division of labor — "CLAUDE.md = your
requirements, auto memory = what Claude observed" — is a two-layer
[context repo](../topics/context-repo.md) in miniature: durable human intent
above, accumulated agent observations below, both as diffable markdown. The
hierarchy itself is
[progressive disclosure](../topics/progressive-disclosure.md): broad
enterprise context loads thin, specifics load near the work.

**Relation to AGENTS.md:** the two coexist rather than compete. AGENTS.md won
the cross-tool convention (read by ~30 tools); CLAUDE.md is richer but
Claude-specific. The common repo pattern — used by this kit, and by
[duo](../tools/duo.md) in mirror image (duo's AGENTS.md defers to CLAUDE.md as
canonical) — is to make one file canonical and the other a pointer, so
instructions are written once.

**Role in this kit:** kb-kit's root AGENTS.md is canonical and CLAUDE.md is a
shim pointing to it, keeping the KB's schema file (in the
[LLM-wiki](../topics/llm-wiki-pattern.md) sense) agent-agnostic.
