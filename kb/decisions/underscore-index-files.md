---
type: decision
title: "Decision: _index.md and _log.md"
summary: This KB uses underscore-prefixed index and log filenames, deviating from OKF's reserved index.md/log.md.
source: kb-kit maintainers, 2026-07-18
date: 2026-07-18
owner: kb-kit maintainers
tags: [naming, index, okf-deviation]
---

# Decision: _index.md and _log.md

**Decision.** This KB's catalog and change-log files are `_index.md` and
`_log.md` — not the `index.md`/`log.md` names that
[OKF v0.1](../sources/okf-spec.md) reserves. They serve exactly the
OKF-reserved roles: `_index.md` is the progressive-disclosure catalog
(bulleted `[Title](./path.md) - description` entries, one screen per index);
`_log.md` records changes under `## YYYY-MM-DD` headings, newest first.

**Why deviate.**

1. **Sort order.** An underscore prefix sorts the index and log to the top of
   every file navigator (GitHub file listing, editors, `ls`), which serves
   their read-me-first purpose. Plain `index.md` buries the entry point
   mid-alphabet.
2. **Duo compatibility.** [Duo](../tools/duo.md)'s vault engine made
   `_index.md`/`_log.md` its paired-listing default (ENH-245, legacy
   non-underscore honored, never mixed), regenerating listings below a
   `<!-- duo:listing -->` fence. Matching it means a kb-kit bundle opens
   cleanly in duo, and the root `_index.md` keeps the fence for that reason.

**What was rejected.** Strict OKF reserved names (loses sort-first and duo
default); carrying both names (duo explicitly forbids mixing; two catalogs
drift).

**Consequences.** This is the kit's second documented OKF deviation (with
[relative links](./relative-markdown-links.md)). Strictly, OKF conformance
requires reserved-name *structure* "when present" — an `_index.md` is a
non-reserved file, so ours carry frontmatter with a `type` to stay
conformant-as-concepts. The research notes flag a candidate upstream
compatibility PR to reconcile duo's default with Google's reserved names;
track it on [open-knowledge-format](../standards/open-knowledge-format.md).
