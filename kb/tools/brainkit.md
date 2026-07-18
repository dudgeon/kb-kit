---
type: tool
title: brainkit
summary: "A second brain for work that compounds" — a forkable Claude-Code-oriented KB kit whose knowledge folder is a valid OKF vault.
source: https://github.com/dudgeon/loop-library
maker: dudgeon (kb-kit maintainer; described here neutrally as a public example)
url: https://github.com/dudgeon/loop-library
tags: [brainkit, second-brain, okf, kit]
---

# brainkit

brainkit (v0.3.0, "contract v2", shipped in `dudgeon/loop-library` under
`dist/brainkit`) is a public example of a forkable personal-KB kit — built by
this kit's maintainer, described here on the same terms as any other tool in
the survey. Tagline: "A second brain for work that compounds." It layers
**loopkit** (a FOUNDATION.md contract) under **brainkit** (application
policy), with CLAUDE.md as the operating manual and skills for
**ingest → query → distill** (distill = Karpathy's lint; see the
[LLM-wiki pattern](../topics/llm-wiki-pattern.md)) plus **sync**, which
curates upstream kit updates via a `loop.manifest.json` managed-files list.

Its `knowledge/` folder ships as a valid
[OKF](../standards/open-knowledge-format.md) vault — the bridge to
[duo](./duo.md), the app that defines the vault flavor. Conventions kb-kit
directly inherits:

- The **frontmatter floor** ("never ceiling"): `summary`, `type`, `source`
  (provenance or `unverified`) — and the load-bearing rule "Keep frontmatter
  keys you don't recognize. Never drop a key you didn't write."
- Type templates as prose plus minimal frontmatter, with optional `statuses`
  ladders (e.g. source: unread → reading → read → processed).
- Linking, verbatim: "Plain relative markdown... Never `[[wikilinks]]`, never
  absolute `/paths`" — resolve `[[Name]]` gestures before saving (see
  [relative markdown links](../decisions/relative-markdown-links.md)).
- One topic per file, lowercase-hyphenated names, one-screen indexes.

Ideas kb-kit deliberately did *not* adopt include folders derived from a
`parent:` edge ("the path is a projection of the graph"), minted `id:` keys
for link healing, and `golden/` locked context — richer machinery than a
starter kit needs (see [minimal typing](../decisions/minimal-typing.md)).
