---
type: tool
title: Obsidian (vault-as-agent-KB pattern)
summary: A local vault of plain markdown as agent memory/inbox/KB — Obsidian supplies the human UX, the folder is agent-native.
source: https://obsidian.md/
maker: Obsidian
url: https://obsidian.md/
tags: [obsidian, vault, local-first, markdown]
---

# Obsidian (vault-as-agent-KB pattern)

Obsidian itself is a markdown note-taking app; what earns it a page here is
the community pattern that went mainstream among practitioners in 2026:
**a vault of plain markdown on local disk used as an agent's memory, inbox,
and knowledge base**, accessed either by direct filesystem access or through
Obsidian MCP servers (see [MCP](../standards/mcp.md)).

The division of labor is clean. Obsidian supplies what humans need — graph
view, backlinks, an editing UX; the underlying folder of `.md` files is
already agent-native context, no export step required. The same files serve
both audiences, which is the core property of a
[context repo](../topics/context-repo.md).

Karpathy's [LLM-wiki gist](../sources/karpathy-llm-wiki-gist.md) recommends
exactly this tooling: Obsidian as the IDE (Web Clipper for capture, graph
view, Dataview) over "just a git repo of markdown files." Practitioner reports
in the gist's comments use private git + Obsidian (or an MCP server) for team
sharing.

One friction point matters for format design: Obsidian's native
`[[wikilinks]]` conflict with [OKF](../standards/open-knowledge-format.md)'s
markdown-links-only rule and break GitHub rendering — the reason this kit
forbids them (see
[relative markdown links](../decisions/relative-markdown-links.md)).
[Duo](./duo.md) hit a sharper version of the same issue: frontmatter wikilinks
create phantom nodes in Obsidian's own graph, which drove its switch to quoted
relative markdown links in frontmatter. Vaults work best as agent KBs when
they keep to the portable subset of Obsidian's features.
