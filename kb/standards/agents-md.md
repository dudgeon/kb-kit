---
type: standard
title: AGENTS.md
summary: The de facto standard repo-root instruction file for coding agents — convention plus location, no schema.
source: https://agents.md/
steward: Agentic AI Foundation (Linux Foundation), since 2025-12-09
status_note: adopted — de facto winner among instruction-file conventions
url: https://agents.md/
tags: [agents-md, instructions, linux-foundation]
---

# AGENTS.md

AGENTS.md is a plain-markdown file at a repo root that gives coding agents
project instructions. Originated by OpenAI (with Google, Cursor, Factory, and
Sourcegraph); stewarded since 2025-12-09 by the Agentic AI Foundation under
the Linux Foundation.

**Adoption reality:** it is the de facto winner in its category — read by
roughly 30 tools (Codex, Copilot, Cursor, Windsurf, Amp, Devin, Aider, Zed,
Jules, and others) and present in 60k+ repositories. One 2026 study measured
−29% median agent runtime and −17% output tokens when an AGENTS.md is present.
Notably, there is **no schema**: the entire value is convention plus location.

**Relation to neighbors:** it coexists with Anthropic's
[CLAUDE.md](./claude-md.md) memory hierarchy rather than competing —
Claude-side tooling reads its own files, and many repos (including this one)
keep AGENTS.md canonical with CLAUDE.md as a pointer. In Karpathy's
[LLM-wiki pattern](../topics/llm-wiki-pattern.md), AGENTS.md is the "schema"
layer — the document telling the LLM how the wiki is structured and which
workflows to follow. Its governance home is shared with
[Agent Skills](./agent-skills.md), making the Agentic AI Foundation the
current center of gravity for agent-facing conventions.

**Role in this kit:** the repo-root `AGENTS.md` is this KB's schema file: it
defines the frontmatter floor, the linking rules, and the
ingest/query/lint loop for any agent working in `kb/`.
