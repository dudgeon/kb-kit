---
type: log
title: Knowledge base — change log
---

# Change log

Newest first. Entry format: `## YYYY-MM-DD` heading, bulleted changes, each
naming the operation (`ingest | lint | setup | edit`) and the pages touched.

## 2026-07-18

- lint | First full lint pass. Auto-fixed: root `_index.md` section headers
  now link to the five folder indexes (they were unreachable from the front
  door). Verified: 29 content pages, 241 internal links, 0 orphans, 0 broken
  links beyond the two deliberate not-yet-written targets, every page ≤4 hops
  from the root. kb-card inferred block populated for the first time.
  Proposed (not applied): exclude `kb/templates/` files from the site's
  type-listing pages — each template currently double-counts as a page of its
  own type. Pages touched: _index.md, ../kb-card.md.
- ingest | Re-fetched the three egress-blocked sources from an unrestricted
  network. Cerebras blog read in full: corrected the secondhand stack claim
  (Postgres/pgvector + FTS + RRF, not SQLite FTS5), confirmed 15,000+ queries
  **per day**, corrected date to 2026-07-15; Prukalpa essay quotes verified
  and corrected to exact wording; Karpathy gist quotes byte-verified. All
  three `retrieval:` flags now primary. Pages touched:
  sources/cerebras-kb-blog.md, sources/prukalpa-github-for-context.md,
  sources/karpathy-llm-wiki-gist.md, sources/_index.md, _index.md,
  topics/context-repo.md, topics/open-questions.md.
- ingest | Open questions topic added from maintainer discussion (multiplayer
  lint/governance, ossifying authority, volatile linked sources) — pages
  touched: topics/open-questions.md, topics/_index.md, _index.md.
- ingest | Initial content build from the mid-2026 landscape research: 6 topic
  pages (`topics/`), 6 standard pages (`standards/`), 7 tool pages (`tools/`),
  6 source pages (`sources/`), 3 decision pages (`decisions/`), plus an
  `_index.md` in each content folder; root `_index.md` rewritten to catalog
  all 28 pages.
- setup | Bundle scaffolded: `_index.md`, `_log.md`, type templates
  (note, source, decision, topic, standard, tool).
