---
name: query
description: Answer a question from this knowledge base with citations, navigating via indexes rather than loading everything. Use when a user asks what the KB knows about something, or any question this repo's content could answer.
---

# query — answer from the KB, cite the KB

1. **Navigate, don't glob.** Read `kb/_index.md` first; follow links (folder
   indexes → pages) to what's relevant. Only fall back to grep when the
   indexes fail you — and if they do, that's an index gap worth reporting.
2. **Answer with citations.** Every substantive claim links the KB page it
   came from; where the page cites an external source, surface that too.
   Distinguish clearly between what the KB says and what you know from
   elsewhere — if you must go beyond the KB, label that part explicitly.
3. **Report gaps honestly.** "The KB doesn't cover X" is a good answer.
   Offer to ingest the missing material (the ingest skill) rather than
   papering over the gap.
4. **File reusable answers back.** If the synthesis would help the next
   asker — a comparison, a "how do these relate" explanation — offer to save
   it as a page (usually `type: note`, `source:` naming the pages it draws
   on), linked from the relevant index, with a `_log.md` entry. Don't file
   one-off lookups.
