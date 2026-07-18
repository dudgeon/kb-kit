---
type: tool
title: duo
summary: A macOS human+agent pairing workspace that defines and implements an OKF-aligned vault format.
source: https://github.com/dudgeon/duo
maker: dudgeon (kb-kit maintainer; described here neutrally as a public example)
url: https://github.com/dudgeon/duo
tags: [duo, vault, electron, okf]
---

# duo

duo is a macOS Electron app — terminal, browser, file tree, and markdown
editor in one window, with a `duo` CLI so the agent acts on what the human
sees. It is not itself a vault: it **defines and implements a vault format**
(duo's "Open Knowledge Format" — same name as, and aligned with,
[Google's OKF](../standards/open-knowledge-format.md); vault roots carry
`okf_version: "0.1"`). [brainkit](./brainkit.md)'s knowledge folder ships as a
valid vault in this flavor — the bridge between the two projects. Built by
this kit's maintainer; described here on survey terms.

Vault conventions that shaped kb-kit:

- **`_index.md` / `_log.md`** as the paired listing default (legacy
  non-underscore honored, never mixed), regenerated below a
  `<!-- duo:listing -->` fence — the direct ancestor of this kit's
  [underscore index files](../decisions/underscore-index-files.md).
- **Relative markdown links only**; `[[ ]]` is an input gesture rewritten at
  rest. Notably, duo *reversed* an earlier wikilink decision (ENH-266,
  2026-07-09) after Obsidian testing showed frontmatter wikilinks create
  phantom graph nodes — entity-reference fields are now quoted relative
  markdown links (`owner: "[Alice Park](../people/alice-park.md)"`).
- "The vault IS the schema" — the corpus is computed live, never cached;
  auto-relink heals moved links by `id` on vault open.
- Agent posture: propose, don't mutate — CriticMarkup tracked suggestions;
  archiving and moves are proposal-only. kb-kit's conduct rules echo this.

One compatibility wrinkle worth tracking: duo's `_index.md` default technically
diverges from Google OKF's reserved `index.md`/`log.md` names — the same
deviation this kit documents and accepts.
