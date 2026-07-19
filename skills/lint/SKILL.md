---
name: lint
description: Health-check this knowledge base — broken links, orphans, stale claims, frontmatter violations, index drift — propose fixes, and refresh the inferred section of kb-card.md. Use when asked to lint, check, clean up, or grade the KB, or on a maintenance schedule.
---

# lint — keep the KB compounding instead of rotting

Lint **proposes**; it fixes mechanical problems freely but never deletes or
restructures content without approval. Its write scope is `kb/` plus exactly
one file outside it: the marked inferred block of `kb-card.md` (pass 3).
Findings about anything else outside `kb/` — docs drift, structural issues,
the card's declared core — go in the report as proposals; changing non-kb
content is a governed process (see "The agent-managed boundary" in
AGENTS.md). Conventions: root [AGENTS.md](../../AGENTS.md); grading rubric:
[docs/taxonomy.md](../../docs/taxonomy.md).

## Pass 1 — mechanical (fix directly)

Start with `node scripts/lint-kb.mjs --json` — it runs this whole pass
deterministically (frontmatter floor, wikilinks/absolute links, dangling
links, reachability, orphans, inbox queue depth) and is the same check CI
runs. Fix what it reports, then verify by re-running. The rules, for
reference:

- Frontmatter floor: every `kb/**/*.md` (except `_index.md`/`_log.md`, and
  everything in `kb/inbox/` and `kb/sources/raw/`, which hold raw material
  by contract) has parseable YAML with `type` matching a template; flag
  missing `summary`/`source`.
- Inbox: list items sitting in `kb/inbox/` — the inbox is the unprocessed
  queue and should trend toward empty; propose an ingest sweep if anything
  has lingered. Check open GitHub issues too (`gh issue list`) — issues
  containing knowledge are the same queue in another door (ingest skill). Never flag `kb/sources/raw/` contents as stale or orphaned —
  archived originals are permanent by design and reached via their source
  page's `raw:` pointer, not via indexes.
- Links: find broken relative links (typos/moved files — fix; genuinely
  unwritten targets — leave, they're intentional); find any `[[wikilinks]]`
  or absolute `/paths` and convert to relative markdown.
- Indexes: every page reachable from `kb/_index.md` within a few hops; every
  index entry points at a real file; indexes ≈ one screen.

## Pass 2 — editorial (propose, don't apply)

- **Orphans** — pages nothing links to: propose where they belong.
- **Drift** — pages that should mention each other but don't; cross-references
  a past ingest should have updated.
- **Contradictions & staleness** — claims newer sources supersede; undated
  time-sensitive claims ("currently", "recently") — propose dating them.
- **Machinery drift** — machinery files (site, skills, scripts, workflows,
  AGENTS.md) changed since `pattern-log.md`'s newest entry (check
  `git log -- <machinery paths>` against the log's top date): propose the
  missing entries. The upgrade skill depends on this ledger being complete.
- **Type pressure** — clusters of `note` pages sharing a shape (propose a new
  type) or a type with one lonely page (propose folding it).
- Present findings as a short report: what was auto-fixed, what's proposed,
  what questions the KB should ingest answers to next.

## Pass 3 — refresh the kb-card

Rewrite ONLY the block between `<!-- BEGIN kb-card:inferred -->` and
`<!-- END kb-card:inferred -->` in `kb-card.md` (never the declared
frontmatter): a fenced yaml block with `inferred_at` (today), `pages`, `types`
census, `links` {internal, broken, orphan_pages}, `freshness` {last_ingest,
log_entries_90d}, and `taxonomy_grades` — grade each taxonomy dimension
`functional | good | great` against the rubric's criteria, honestly; grades
must be defensible from the pass-1/2 evidence.

## Close out

Append to `kb/_log.md`: `lint | summary of fixes/proposals`. If substantial
findings, suggest the owner make lint a habit (e.g. asking their agent
monthly). There is deliberately no server-side automation for this — the
editorial passes need a strong model, and the kit must work for owners
whose only agent is their local session.
