---
type: topic
title: Progressive disclosure
summary: The shared mechanism across skills, OKF, CLAUDE.md, and MCP — load near-zero tokens until knowledge is actually needed.
source: synthesized from linked sources, 2026-07-18
tags: [progressive-disclosure, tokens, indexes]
---

# Progressive disclosure

Progressive disclosure is the one mechanism every surviving context standard
shares: expose a cheap summary layer first, and load the expensive full content
only when it is actually needed. It is the survey's second cross-cutting
takeaway (after "markdown-in-git won").

Where it appears:

- **[Agent Skills](../standards/agent-skills.md)** — a SKILL.md's YAML
  name/description costs near-zero tokens until the skill triggers; the
  instructions and bundled scripts load only then.
- **[OKF](../standards/open-knowledge-format.md)** — the spec names
  progressive disclosure as the explicit purpose of `index.md`: a directory
  listing of `[Title](url) - short description` bullets that lets an agent
  navigate without reading every concept.
- **[CLAUDE.md](../standards/claude-md.md)** — the memory hierarchy layers
  enterprise/project/personal files plus imports, with best practice a lean
  80–120 high-signal lines at the top.
- **[MCP](../standards/mcp.md)** — servers advertise resource and tool
  listings; content is fetched per-URI on demand.
- **[llms.txt](../standards/llms-txt.md)** — a root index curating a whole
  site for LLM consumption.

This KB applies the same mechanism twice over. Every folder carries a
one-screen `_index.md` (see
[underscore index files](../decisions/underscore-index-files.md)), and the
query workflow starts at the root index, never with a full-tree read.

kb-kit extends the mechanism one level up: the repo-root `kb-card.md` is
progressive disclosure *for whole knowledge bases* — a summary an agent can
read before deciding to clone or query the bundle at all. That extension is the
subject of [KB discovery](./kb-discovery.md).
