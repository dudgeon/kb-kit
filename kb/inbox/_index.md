---
type: index
title: Inbox — the unprocessed queue
---

# Inbox

Drop anything here that should end up in the knowledge base but isn't
knowledge yet: pasted meeting notes, a URL in a text file, an exported
thread, a half-formed thought. **No format required** — no frontmatter, no
naming rules. Getting material *captured* beats getting it *right*.

The contract:

- **Presence here means unprocessed.** This folder is the KB's work queue —
  listing it answers "is there material waiting?", and empty means caught
  up. Nothing in it is searchable on the site or trusted by agents; the
  site build skips it on purpose.
- **The [ingest skill](../../skills/ingest/SKILL.md) sweeps it.** Ask an
  agent to "process the inbox": each item becomes a distilled
  [source page](../templates/source.md), gets propagated across affected
  pages and indexes, and is recorded in the [log](../_log.md).
- **Ingesting moves items, never deletes them.** The original file moves to
  [`kb/sources/raw/`](../sources/raw/_index.md) — the immutable archive —
  and the new source page links to it. Location encodes state: inbox =
  waiting, raw = processed and preserved.
- **An empty inbox is a healthy inbox.** Lint flags items that sit here
  unprocessed.

(This file stays; everything else in the folder is on its way somewhere.)
