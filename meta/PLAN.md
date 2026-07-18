# kb-kit build plan (working doc)

A forkable starter kit for product teams (PM-first) to build knowledge bases —
context repos that agents and humans add to, curate, and query.

## Settled by research (defaults; interview may override)

1. **Spec anchor**: Google OKF v0.1 conformant bundle (`type` required in
   frontmatter everywhere; reserved `index.md`/`log.md`; tolerate-everything
   consumer posture), with brainkit-compatible choices where the spec allows:
   - **Relative markdown links** (`[label](./note.md)`) — OKF-valid, renders on
     GitHub + GitHub Pages + Obsidian; never wikilinks, never absolute `/paths`
     (Google's "recommended" absolute form breaks GitHub rendering).
   - `index.md` / `log.md` (Google reserved names; duo honors these as legacy).
   - Frontmatter superset: `type` (required) + recommended `summary`/
     `description`, `source` (provenance), `tags`, `title`, `aliases`.
2. **Karpathy loop as the operating model**: ingest → query → lint(distill),
   schema file = AGENTS.md (canonical) with CLAUDE.md shim (agent-agnostic,
   inverse of duo's arrangement — TBD in interview).
3. **kb-card.md** at repo root: model-card analog for KBs — the discovery/
   description layer nobody has standardized yet. Natural synergy with the
   taxonomy: card fields = taxonomy dimensions (scope, freshness, provenance,
   coverage, maturity, access, contact). Machine-readable YAML frontmatter +
   human prose.
4. **Site**: pure static GitHub Pages (no server/db/workers). GitHub Action
   builds a manifest + search index (JSON) from the KB at push; client-side
   rendering (fetch md → render), keyword search UI, frontmatter pills that
   crosslink, `index.html` marketing page + `knowledge-base.html` browser.

## Deliverables

1. `TAXONOMY.md` (or in-KB) — what makes a good/great context repo (graded
   dimensions; doubles as kb-card vocabulary).
2. Baseline structure: `kb/` (or `knowledge/`) bundle + templates + AGENTS.md/
   CLAUDE.md schema + skills (ingest/query/lint at minimum).
3. Utilities: Pages site (search, md wrapper, pills), build Action, link check.
4. `index.html` — polished marketing page for kb-kit.
5. `README.md` — purpose, fork-me instructions, links to Pages site +
   knowledge-base.html.
6. Placeholder KB content: survey of the context-management landscape
   (research/ folder holds raw source notes to ingest).
7. `kb-card.md` — spec + filled example for this repo's own KB.

## Open questions for the maintainer interview (one at a time)

- Q1 Structure depth: OKF-minimal vs brainkit-style typed graph vs middle path?
- Q2 Schema file arrangement: AGENTS.md canonical + CLAUDE.md shim, or reverse?
- Q3 KB folder name: `kb/`, `knowledge/` (brainkit), other? Repo = bundle root?
- Q4 Skills set: ingest/query/lint only, or + sync (managed-files updates)?
- Q5 kb-card: fields, and should the card frontmatter be the machine layer with
  prose body? Registry/crawler story?
- Q6 Site tech: vanilla JS vs small framework; build-time pre-render vs pure
  client-side; look/feel.
- Q7 Placeholder content shape: how many pages, entity types to demo.
- Q8 License, naming, tone of marketing page.
- Q9 What to PR back to duo (e.g. `_index.md` vs Google-reserved `index.md`
  conformance note).

## Phases

1. Research ✔ (see research/)
2. Interview → lock decisions (log in INTERVIEW-LOG.md)
3. Scaffold: bundle structure, schema files, templates, kb-card
4. Content: taxonomy + landscape KB pages
5. Site: Action + HTML/JS/CSS, search, pills
6. Polish: README, marketing page, link-check CI, delete temp files
