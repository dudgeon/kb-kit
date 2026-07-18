# Research notes: Google Open Knowledge Format (OKF) v0.1

Sources: [Google Cloud blog announcement](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing),
[SPEC.md](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md),
[README](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/README.md).
Status: **v0.1 Draft**, published ~2026-06-12, Apache 2.0.

## Core model

> "The format is intentionally minimal: a directory of markdown files with YAML
> frontmatter. There is no schema registry, no central authority, and no required
> tooling. If you can `cat` a file, you can read OKF; if you can `git clone` a
> repo, you can ship it."

- **Knowledge Bundle** — self-contained hierarchical collection of knowledge
  documents; the unit of distribution. Git repo (recommended), tarball, or
  subdirectory of a larger repo.
- **Concept** — one unit of knowledge = one UTF-8 markdown file. **Concept ID** =
  file path minus `.md` (`tables/users.md` → `tables/users`). Path *is* identity.
- **Reserved filenames** (must not be concept docs): `index.md` (directory
  listing, progressive disclosure) and `log.md` (update history, newest-first,
  `YYYY-MM-DD` ISO date headings). All other `.md` files are concepts.
- Directory layout is otherwise free — producers organize by domain.

## Frontmatter (§4.1)

```yaml
---
type: <Type name>        # REQUIRED — the only required field
title: <display name>    # optional
description: <one-line>  # optional
resource: <canonical URI for underlying asset>  # optional
tags: [tag, ...]         # optional
timestamp: <ISO 8601>    # optional last-modified
---
```

- Types are NOT centrally registered. "Producers SHOULD pick values that are
  descriptive and self-explanatory; consumers MUST tolerate unknown types
  gracefully."
- "Producers MAY include any additional keys. Consumers SHOULD preserve unknown
  keys when round-tripping and SHOULD NOT reject documents with unrecognized
  fields."

## Body conventions (§4.2)

Standard markdown; favor structural markdown over freeform prose. Three headings
with *conventional* (not required) meaning: `# Schema`, `# Examples`,
`# Citations`. Citations numbered `[1] [label](url)`, optionally mirrored into a
`references/` subdirectory as first-class concepts.

## Linking (§5)

**Standard markdown links only — no wikilinks.** Two forms:
- Absolute bundle-relative starting `/` — spec-"recommended" for move-stability
  (`[customers table](/tables/customers.md)`).
- Relative (`./other.md`) — also valid.
- A link asserts a *relationship*; kind conveyed by surrounding prose.
- "Consumers MUST tolerate broken links — ... it may simply represent
  not-yet-written knowledge."

⚠ kb-kit note: bundle-root-absolute links do NOT render correctly in the GitHub
web UI or on GitHub Pages (they resolve against the domain root). Relative links
are spec-valid and render everywhere → kb-kit uses relative links.

## index.md / log.md

- `index.md` optional in any directory; purpose is **progressive disclosure**;
  normally NO frontmatter; sections of `* [Title](url) - short description`
  bullets. Exception: the bundle-root `index.md` MAY carry a frontmatter block —
  the only place it's permitted — to declare `okf_version: "0.1"`.
- `log.md` optional; change history, newest first; "Date headings MUST use ISO
  8601 `YYYY-MM-DD` form."

## Conformance (§9, verbatim)

> A bundle is **conformant** with OKF v0.1 if:
> 1. Every non-reserved `.md` file in the tree contains a parseable YAML
>    frontmatter block.
> 2. Every frontmatter block contains a non-empty `type` field.
> 3. Every reserved filename (`index.md`, `log.md`) follows the structure
>    described in §6 and §7 respectively when present.

Consumers MUST NOT reject a bundle for: missing optional fields, unknown types,
unknown keys, broken links, missing index.md files.

## Goals / positioning

Goals: a universal format enrichment agents write into; guidance for consumption
agents; exchange across orgs; standardize the few required fields. Values:
readable (humans, no tooling), parseable (agents, no SDKs), diffable (git),
portable. Consumers: "a static file server, a knowledge-management UI (Obsidian,
Notion, MkDocs), an LLM loading files into context, a search index, or a graph
viewer." Non-goals: no fixed type taxonomy, no infra, doesn't replace
domain-specific schemas (it references them).

Repo ships: a reference enrichment agent (Python, Gemini + BigQuery), a
`visualize` command producing a self-contained interactive HTML graph
(Cytoscape.js, backlinks, search, type filter), and three sample bundles (GA4
e-commerce, Stack Overflow, Bitcoin).

Explicitly credits/formalizes the Karpathy "LLM wiki" pattern; §10 positions OKF
as that pattern "specified."
