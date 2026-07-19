---
type: standard
title: Agent Skills (SKILL.md)
summary: Open spec for packaged agent capabilities — YAML metadata plus instructions, loaded via progressive disclosure.
source: https://agentskills.io/
steward: Agentic AI Foundation (Linux Foundation); originated by Anthropic
status_note: open spec since 2025-12-18; ~40 products support it
url: https://agentskills.io/
tags: [skills, skill-md, progressive-disclosure]
---

# Agent Skills (SKILL.md)

A skill is a directory containing a `SKILL.md` (YAML `name`/`description` plus
markdown instructions) and optional scripts and templates. Its defining
mechanism is [progressive disclosure](../topics/progressive-disclosure.md):
the metadata costs near-zero tokens until the skill triggers, at which point
the full instructions load.

Originated by Anthropic; opened as a spec at agentskills.io on 2025-12-18
under Agentic AI Foundation governance (alongside
[AGENTS.md](./agents-md.md)). Reference repo:
https://github.com/anthropics/skills

**Adoption reality:** ~40 products support the format (Claude, Codex, Copilot,
VS Code, Cursor, Gemini CLI, Goose, and others). SkillsMP indexes ~1.9M public
skills. Quality is uneven: SkillsBench reports a mean quality of 6.2/12, with
curated skills adding +16 points to pass rate — volume has outrun curation.

**Positioning:** skills are "how to do X," complementing
[MCP](./mcp.md)'s "connect to X." A useful third leg from the July-2026
commentary: [OKF](./open-knowledge-format.md) covers "what the agent knows" —
skills, connections, and knowledge as three separable standards.

**Role in this kit:** kb-kit ships its workflows (`setup`, `ingest`, `query`,
`lint`) as agent-agnostic skills in `skills/<name>/SKILL.md`, so any
skill-aware agent can operate this KB. Prukalpa's essay lands on the same
mechanism from the enterprise side: domain experts encoding knowledge into
shared skills in one "company brain"
([source](../sources/prukalpa-github-for-context.md)).
