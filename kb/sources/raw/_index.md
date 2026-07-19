---
type: index
title: Raw archive — immutable originals of processed sources
---

# Raw archive

The originals behind this KB's [source pages](../_index.md) — the raw layer
of the [LLM-wiki pattern](../../topics/llm-wiki-pattern.md): material the KB
reads from but never modifies.

The contract:

- **Files arrive here by being ingested.** When the
  [ingest skill](../../../skills/ingest/SKILL.md) processes an
  [inbox](../../inbox/_index.md) item, it moves the original file here and
  links it from the distilled source page (`raw:` frontmatter). Presence
  here means *processed and preserved*.
- **Immutable.** Never edit, rewrite, or "clean up" a file in this folder.
  Corrections, context, and disagreement belong in the distillation layer —
  the source page and the pages it propagates to.
- **Not indexed.** The site build skips this folder so verbatim originals
  don't drown the distilled pages in keyword search. Files are still
  viewable by direct link, and agents read them on demand by following a
  source page's `raw:` pointer.
- **Sources that live elsewhere don't need a copy here.** A page whose
  `url:` points at a stable canonical home (a published article, a spec)
  may have no raw file — the web is its archive. This folder is for
  material whose only home is this KB, plus whatever the inbox delivered.

(This file stays; everything else here is permanent by design.)
