---
type: standard
title: MCP — Resources and the Registry
summary: The protocol layer for delivering context to agents (Resources) and discovering servers (the official Registry).
source: https://registry.modelcontextprotocol.io/
steward: MCP open governance; July 2026 spec release candidate
status_note: protocol widely adopted; Resources least-adopted primitive; Registry in preview since 2025-09-08
url: https://registry.modelcontextprotocol.io/
tags: [mcp, resources, registry, discovery]
---

# MCP — Resources and the Registry

The Model Context Protocol matters to this survey at two points: how context
is *delivered* to agents (Resources) and how knowledge sources are *found*
(the Registry). MCP has open governance, with a July 2026 spec release
candidate.

**MCP Resources** are URI-identified data a server exposes as context, under
application control. They are the least-adopted MCP primitive — client UX is
immature — but docs-as-MCP is growing: GitBook auto-exposes an MCP server for
published docs, and docs servers fed by [llms.txt](./llms-txt.md) are common.
Resources fetch content per-URI on demand, another instance of
[progressive disclosure](../topics/progressive-disclosure.md).

**The official MCP Registry** is a centralized metadata catalog of MCP servers
with an open API and namespace verification, in preview since 2025-09-08 and
listing ~9,650 servers as of 2026-05, with subregistries building on top. It
is the nearest thing that exists to a discovery standard for agent-accessible
knowledge sources — which makes it the closest prior art for the kb-card idea
(see [KB discovery](../topics/kb-discovery.md)), even though `server.json`
describes a server, not a knowledge bundle.

**The protocol triad framing** from the July-2026 commentary: MCP is how an
agent connects to tools, [A2A](./a2a.md) is how agents talk to each other, and
[OKF](./open-knowledge-format.md) is what the agent knows.
[Agent Skills](./agent-skills.md) complete the picture as "how to do X."
An OKF bundle can itself be served over MCP — the Obsidian-vault pattern
(see [obsidian](../tools/obsidian.md)) already works this way.
