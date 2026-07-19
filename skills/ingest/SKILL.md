---
name: ingest
description: Add a source or fact to this knowledge base and propagate it — write the source page, update affected topic/note pages, indexes, and the log. Use when a user shares an article, link, document, meeting notes, or says "add this to the KB".
---

# ingest — one source in, many pages touched

Read the root [AGENTS.md](../../AGENTS.md) conventions first. The unit of
work is: **capture verbatim → distill → propagate → record.** Ingest writes
only inside `kb/`; if a source implies a change outside it (docs, kb-card
declared core, repo structure), *propose* that to the owner — non-kb content
is authoritative and changes to it are governed (see "The agent-managed
boundary" in AGENTS.md).

Knowledge arrives through three channels; this skill serves all of them:

1. **The current session** (most common): the user has been teaching you
   something — a discussion, a pasted document, a worked-out decision — and
   says "ingest this." The session content IS the source; capture it
   faithfully (attribute to the user + date) before it scrolls away.
2. **The inbox** — files dropped in `kb/inbox/` (sweep below).
3. **GitHub issues** — contributors who never clone can open an issue
   containing or pointing at knowledge; sweeps scan them (below).

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

**Inbox sweep** ("process the inbox"): `kb/inbox/` is the unprocessed
queue — presence there means not yet ingested. Treat every file in it
(except its `_index.md`) as a source and run steps 0–4 on each; an inbox
item with a URL means fetch that URL (step 0 honesty rules apply). After
capturing an item, **move the original to `kb/sources/raw/`** (never
delete, never edit it — see `kb/sources/raw/_index.md`) and link it from
the source page: `raw: ./raw/<file>` in frontmatter plus a body link.
Location encodes state, so a half-done sweep is safe to resume: whatever is
still in the inbox is still unprocessed. Archive freely — the maintainer
has ruled that preserving copies of freely available content in the raw
archive is fine (fair use); don't stop to ask. Note the sweep in the
`_log.md` entry.

**A sweep also scans GitHub issues.** List the repo's open issues (`gh
issue list`) and treat any that contain or point at knowledge as inbox
items: run steps 0–4 (capture the issue's text/links verbatim; credit the
issue author and number in `source:`). After ingesting, comment on the
issue saying what landed where (link the pages) and propose closing it —
comment-and-close is the issue equivalent of the move-to-raw step, and the
issue thread remains the permanent original. Issues that are questions or
bug reports, not knowledge, are out of scope — leave them.
