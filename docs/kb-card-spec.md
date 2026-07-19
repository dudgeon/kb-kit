# kb-card: a model card for knowledge bases

A **kb-card** is a single file, `kb-card.md`, at the root of a repository that
contains a knowledge base. It does for KBs what a model card does for models:
lets a human or agent judge scope, ownership, freshness, and trustworthiness
**without reading the KB** — and lets an org-wide crawler index hundreds of
KBs by fetching one well-known path per repo.

Status: draft v0.1, defined by [kb-kit](../README.md). There is no adopted
standard for describing KBs (mid-2026); this is a proposal shaped to be
crawlable today with nothing but GitHub code search for `path:kb-card.md`.

## Design rules

1. **One file, fixed name, repo root.** `kb-card.md`. Discoverability beats
   configurability.
2. **Frontmatter is the machine layer; prose is the human layer.** The YAML
   block must stand alone for a crawler; the body may say more.
3. **Declared vs inferred.** Humans declare only what tools cannot know
   (scope, ownership, access). Everything measurable — page counts, type
   census, freshness, link health, taxonomy grades — is **inferred by lint**
   and written between HTML markers. Humans never hand-edit the inferred
   block; aspirational self-grading is exactly the failure mode model cards
   suffer, and computing the traits avoids it.
4. **OKF-compatible.** The card is itself a valid OKF concept
   (`type: kb-card`), and unknown keys must be preserved by any tool.

## Declared core (frontmatter)

Required:

```yaml
---
type: kb-card
kb_card_version: "0.1"
name: <human name of the KB>
description: <one sentence>
scope: <what's in and, ideally, what's out>
owner: <owning team or person>
---
```

Recommended:

```yaml
audience: [<who this serves>]
topics: [<a few tags>]
access: public | internal | restricted
license: <SPDX id or note>
contact: <channel, email, or handle>
entry_points:
  bundle: kb/_index.md        # where the knowledge starts
  site: <GitHub Pages URL>    # browsing UI, if any
  agents: AGENTS.md           # the schema file
established: <YYYY-MM-DD>
external_sources:             # domain knowledge that lives OUTSIDE this repo
  - name: <human name>        # (not all knowledge is in GitHub — the KB
    url: <where it lives>     #  points beyond itself for its domain, and a
    note: <one line on what it is and why it matters here>  # hub/crawler
  # …                         #  may index these alongside the KB)
```

## Inferred traits (lint-owned)

Lint rewrites everything between the markers; the shape inside is:

```markdown
<!-- BEGIN kb-card:inferred -->
```yaml
inferred_at: 2026-07-18
pages: 23
types: {note: 9, source: 6, decision: 3, topic: 5}
links: {internal: 141, broken: 0, orphan_pages: 1}
freshness: {last_ingest: 2026-07-16, log_entries_90d: 14}
taxonomy_grades: {structure: good, linkage: good, provenance: functional, ...}
```
<!-- END kb-card:inferred -->
```

Grades use the [taxonomy](./taxonomy.md) vocabulary
(`functional | good | great`), computed against its per-dimension criteria.
A card with no inferred block is valid — it just says "never linted," which
is itself signal.

## Body (prose, optional but encouraged)

Short sections a first-time visitor wants: **What this is**, **What's
deliberately out of scope**, **How to contribute**, **Caveats** (known gaps,
staleness warnings, trust notes).

## The discovery trajectory (why the card exists)

A company ends up with many KB repos: some are part of a team's daily
routine; others are hard to find and harder to judge. The card is designed
for the systems that fix this, in three stages:

1. **Manual onboarding** — a user registers a KB repo with an org
   **context hub**; the hub reads the card, indexes the KB, and makes it
   searchable. Lint operations can then consider *adjacent* onboarded
   repos (scope negotiation, cross-KB links, overlap detection).
2. **Automatic discovery** — a crawler fans out across the company's whole
   GitHub instance, recognizes KBs by their `kb-card.md`, and pulls them
   into the hub with no onboarding step at all.
3. **Beyond GitHub** — `external_sources` on the card points at the
   domain's knowledge that doesn't live in any repo (wikis, dashboards,
   vendor docs), so the hub's picture of a domain isn't repo-bound.

Nothing in this kit implements a hub or crawler; the kit's job is to
guarantee every fork carries the card those systems need.

## For crawlers

- Find cards: GitHub code search `path:kb-card.md` (org-scoped).
- Parse: YAML frontmatter only; tolerate unknown keys and missing optional
  fields (OKF consumer posture).
- Rank/filter: `topics`, `access`, `owner`, and inferred `freshness` — a card
  whose `inferred_at` is ancient tells you the KB's lint loop is dead, which
  is usually the answer you needed.
- Follow: `entry_points` into the KB, `external_sources` beyond it.

## Progressive discovery

The card is stage one of a deliberate gradient: **card → `kb/_index.md` →
type overviews / folder indexes → pages → cited sources.** Each stage costs an
order of magnitude more context than the last; an agent should descend only as
far as the question requires. This is the same progressive-disclosure
mechanism OKF uses inside a bundle, extended above the bundle so that
*choosing which KB to read* is as cheap as navigating within one.
