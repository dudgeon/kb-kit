---
name: ingest
description: Add a source or fact to this knowledge base and propagate it — write the source page, update affected topic/note pages, indexes, and the log. Use when a user shares an article, link, document, meeting notes, or says "add this to the KB".
---

# ingest — one source in, many pages touched

Read the root [AGENTS.md](../../AGENTS.md) conventions first. The unit of
work is: **capture verbatim → distill → propagate → record.**

0. **Fetch honestly.** If you cannot retrieve the source itself — paywall,
   network block, dead link — and are working from snippets, mirrors, or
   summaries instead, you MUST (a) say so **in your report to the human, up
   front, not buried**, and (b) record it in the page's frontmatter:
   `retrieval: secondary - <how it was reconstructed>` or
   `retrieval: failed - <what is actually known>`. A reconstructed source
   presented as a scraped one poisons every page that cites it. Never let an
   evidence problem live only in the page body.
1. **Capture.** Create one `type: source` page (template:
   `kb/templates/source.md`) in the right folder: frontmatter `type`,
   `summary`, `source` (the URL or provenance), `url`, `date`; body =
   distilled summary, then `## Key excerpts` with verbatim material. Never
   paraphrase inside the excerpt section. lowercase-hyphenated filename.
2. **Discuss.** If the human is present, surface the 2–4 most interesting
   claims and ask which matter to them before propagating. Resolve entity
   mentions ("the vendor" → which page?) rather than guessing; record chosen
   aliases in the target page's `aliases:` frontmatter.
3. **Propagate.** Update every existing page the source genuinely affects —
   topic pages cite it, contradicted claims get the disagreement written down
   (both sides, dated), related pages gain links. A good ingest touches
   several pages; a lazy one touches one. Create new topic/note pages only
   for subjects you'd link to from more than one place. Use only existing
   types; if content repeatedly doesn't fit, propose a new type to the human
   (template + `_log.md` note) — don't silently invent one.
4. **Record.** Update the affected `_index.md` files (keep each ~one screen);
   set the source's status to `processed`; append to `kb/_log.md` under
   today's `## YYYY-MM-DD`: `ingest | <source title> — pages touched: <list>`.

Batch mode (several sources): do steps 1–4 per source, but one combined
discussion up front and one log entry per source. Links: relative markdown
only; a link to a not-yet-written page is allowed and encouraged.
