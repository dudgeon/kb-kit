---
type: decision
title: "Decision: relative markdown links only"
summary: This KB links with plain relative markdown — never wikilinks, never OKF's recommended absolute bundle paths.
source: kb-kit maintainers, 2026-07-18
date: 2026-07-18
owner: kb-kit maintainers
tags: [linking, wikilinks, okf-deviation]
---

# Decision: relative markdown links only

**Decision.** Every link in this KB is plain relative markdown —
`[label](./page.md)` or `../folder/page.md`. No `[[wikilinks]]`, no absolute
`/paths`. A `[[Name]]` gesture from a human is resolved to a relative link
before saving.

**Context.** The three formats this kit draws on disagree. Karpathy's
[LLM-wiki gist](../sources/karpathy-llm-wiki-gist.md) uses `[[wikilinks]]` as
graph edges. [OKF v0.1](../sources/okf-spec.md) forbids wikilinks and
"recommends" bundle-root-absolute links (`/tables/customers.md`) for
move-stability, with relative links also valid. brainkit/duo forbid both
wikilinks and absolute paths.

**Why not wikilinks.** They break GitHub rendering and this kit's static
site, and they are Obsidian-specific rather than plain markdown.
[Duo](../tools/duo.md) supplies harder evidence: it reversed an earlier
wikilink decision (ENH-266, 2026-07-09) after testing showed frontmatter
wikilinks create phantom nodes in Obsidian's own graph.

**Why not OKF's absolute form.** Bundle-root-absolute links do not render
correctly in the GitHub web UI or on GitHub Pages — they resolve against the
domain root. Since a kb-kit fork must be readable on plain GitHub with zero
tooling, the "recommended" form fails the kit's core requirement. Relative
links are OKF-spec-valid and render everywhere, so this is a documented
deviation, not a break: the bundle stays conformant.

**Consequences.** Links are move-fragile (renames must update inbound links —
a lint job). Links to not-yet-written pages are allowed and even encouraged,
per OKF: a broken link "may simply represent not-yet-written knowledge."

Affected: [AGENTS.md linking rules](../../AGENTS.md),
[open-knowledge-format](../standards/open-knowledge-format.md),
[obsidian](../tools/obsidian.md).
