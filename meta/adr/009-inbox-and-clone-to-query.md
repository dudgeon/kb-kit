# ADR 009 — The inbox queue, the raw archive, and honest search with a clone-to-query CTA

Date: 2026-07-18 · Status: accepted (maintainer notes, interview Q11 + Q12)

**Context.** The maintainer wants the site to be honest that its search is
keyword-only, to funnel real questions to the query skill (with a one-command
path for users who don't know how), and to make explicit how information
flows into the KB "via the inbox and ingest." No inbox existed. The Karpathy
gist (the pattern's origin) has a *permanent raw-sources layer* but no queue —
"you drop a new source and tell the LLM to process it," so processing state
lives in the human's head or must be recomputed by diffing the collection
against the log. A first implementation here had the opposite flaw: a queue
whose items were deleted after processing, destroying originals.

**Decision.** Split the two roles the gist conflates, and encode state in
location:

1. **`kb/inbox/` is the queue.** Anyone (human, automation) drops raw
   material there — pasted notes, links, exports — no format requirements.
   **Presence in the inbox MEANS unprocessed**; `ls kb/inbox/` is the whole
   "is there work?" answer, and empty means caught up.
2. **Ingest moves, never deletes.** Processing an inbox item creates the
   distilled `type: source` page and **moves the original file to
   `kb/sources/raw/`** — the immutable archive (Karpathy's layer 1). The
   source page links its archived original (`raw:` frontmatter + a body
   link). Archived originals are never edited; corrections live in the
   distillation layer.
3. **Neither folder is search-indexed.** `build-index.mjs` skips
   `kb/inbox/` (unvetted) and `kb/sources/raw/` (verbatim originals would
   drown the distillations in keyword search). Both remain viewable by
   direct page link, and the raw archive is read on demand by agents
   following a source page's `raw:` pointer.
4. **Lint watches the queue** — items sitting in the inbox are flagged
   (it should trend toward empty) — and exempts both folders from the
   frontmatter floor.
5. **The KB home says what search is and isn't**: keyword-only note, plus a
   copyable one-liner (`git clone <repo>.git && cd <repo> && claude /query`,
   repo derived from config.js at runtime) and a short "how knowledge gets
   in" section: inbox → ingest → distilled pages + archived original + log.

**Consequences.** kb-kit deliberately *extends* the gist: it keeps the
archive (as `kb/sources/raw/`) and adds the queue the gist lacks — noted on
the Karpathy source page. setup keeps both folders (clearing demo residue).
One caveat the skill carries: full third-party texts dropped in the inbox
are archived verbatim in a (possibly public) repo — the ingest skill tells
agents to flag obvious licensing concerns to the owner rather than silently
archiving, and owners of public KBs may prefer link-only drops.
