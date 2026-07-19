# AGENTS.md — how to work in this knowledge base

This file is the **schema** for this repo's knowledge base (KB): it tells any
agent how the KB is structured, what the conventions are, and which workflows
to follow. It is the canonical agent instruction file; `CLAUDE.md` is a
pointer to it. Humans should read it too — it's short on purpose.

## What this repo is

A knowledge base ("context repo") that humans and agents jointly add to,
curate, and query. The knowledge lives in [`kb/`](./kb/_index.md). Everything
else is machinery: a static browsing site (`index.html`,
`knowledge-base.html`), agent skills (`skills/`), kit documentation
(`docs/`), and — in the upstream starter kit only — `meta/`, which holds
files about *building the kit itself* and is not part of any forked KB.

## Forking, and life after the fork

kb-kit is designed to be forked ("Use this template" or Fork on GitHub):

1. **Enable Pages**: Settings → Pages → Source: *Deploy from a branch* →
   `main`, `/ (root)`. Keep the root `.nojekyll` file — without it Pages
   drops every `_index.md`.
2. **Run the [setup skill](./skills/setup/SKILL.md)**: it interviews the new
   owner, clears the demo content, installs the entity types they actually
   need, writes their `kb-card.md`, and records the fork point in
   `pattern-log.md`. Setup also **tailors this file** — the interview's
   answers (folder set, types, external sources) should be reflected here,
   so AGENTS.md keeps describing *this* KB, not the demo.
3. **Then just run the loop** (Workflows below): teach an agent things and
   say "ingest this"; ask questions with the query skill; lint on a cadence.
   Humans who never clone use the site, GitHub issues, and the inbox.

## The agent-managed boundary

Write scope and query scope are different:

- **`kb/` is agent-managed.** The workflows below write there directly
  (within the Conduct rules — destructive changes are still proposed first).
- **Everything outside `kb/` is not agent-managed, but IS in query scope.**
  Answers may draw on and cite `docs/`, `kb-card.md`, this file, the README —
  they are authoritative, human-maintained, and less volatile than the KB.
- **Changes to non-kb content are a governed process.** Lint and ingest may
  *propose* them (an issue, a PR, or an explicit ask in-session), never apply
  them unilaterally. The one standing exception: lint refreshes the marked
  inferred block of `kb-card.md`, and nothing else outside `kb/`.

## Layout

- `kb/` — the knowledge bundle. This is the only place knowledge lives.
  - `kb/_index.md` — root catalog of the KB; read this first, always.
  - `kb/_log.md` — append-only change history (newest first).
  - `kb/templates/` — one file per entity type; defines that type.
  - `kb/inbox/` — the unprocessed queue: raw drops waiting for ingest;
    presence here means "not yet processed." Not knowledge, not indexed.
  - `kb/sources/raw/` — the immutable archive: ingest MOVES processed inbox
    originals here (never deletes, never edits them) and links them from
    the distilled source page via `raw:` frontmatter. Not indexed.
  - other folders — organized by the KB's owner; folders are navigation,
    frontmatter `type` is meaning.
- `kb-card.md` — repo-root card describing this KB (see below).
- `pattern-log.md` — repo-root ledger of changes to the kit MACHINERY
  (see "Customizing the kit" below).
- `skills/<name>/SKILL.md` — agent-agnostic skills: `setup`, `ingest`,
  `query`, `lint`.

## Format: OKF with two documented deviations

The bundle follows the [Open Knowledge Format v0.1](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md):
markdown files with YAML frontmatter, where `type` is the only required key.

1. **Frontmatter floor** — every KB page starts with at least:

   ```yaml
   ---
   type: note            # required; must match a file in kb/templates/
   summary: One line saying what this page is.
   source: unverified    # provenance: a URL, a person + date, or `unverified`
   ---
   ```

   `title`, `tags`, `aliases`, and typed attributes are welcome. **Keep
   frontmatter keys you don't recognize — never drop a key you didn't
   write.**

2. **Links: plain relative markdown only.** `[label](./other-page.md)` or
   `../folder/page.md`. Never `[[wikilinks]]` (they break GitHub and the
   site), never absolute `/paths` (they break GitHub rendering; this is a
   deliberate deviation from OKF's "recommended" absolute form). If a human
   hands you a `[[Name]]` gesture, resolve it to a relative markdown link
   before saving. A link to a page that doesn't exist yet is fine — it marks
   knowledge worth writing.

3. **`_index.md` / `_log.md`, not `index.md` / `log.md`.** Deliberate
   deviation from OKF's reserved names so the index sorts first in file
   navigators (and matches the Duo vault convention). They serve exactly the
   OKF-reserved roles: `_index.md` is the progressive-disclosure catalog
   (bulleted `[Title](./path.md) — one-line description` entries, one screen
   per index); `_log.md` records changes under `## YYYY-MM-DD` headings,
   newest first.

## Types

Types are minimal on purpose and **grow with the KB** — don't invent a type
mid-task. Each type is defined by `kb/templates/<type>.md` (prose + minimal
frontmatter). To add a type: add the template, note it in `kb/_log.md`, and
mention it in `kb/_index.md`. Prefer editing an existing page over minting a
new one unless the subject is a distinct entity you'd link to from elsewhere.

## Workflows (the loop)

- **Ingest** ([skill](./skills/ingest/SKILL.md)) — add a source or fact:
  write/update the affected pages, update every `_index.md` on the path,
  append to `_log.md`. One source may touch many pages; that's the point.
  Information arrives through three channels, one loop: (1) the current
  session — a user teaches the agent something and says "ingest this";
  (2) files dropped in `kb/inbox/`; (3) GitHub issues containing or
  pointing at knowledge. A "process the inbox" sweep scans the inbox AND
  open issues; un-swept items wait for the next maintainer pass.
- **Query** ([skill](./skills/query/SKILL.md)) — read `kb/_index.md` first,
  navigate by links, answer with citations (links to KB pages and their
  sources). File genuinely reusable answers back into the KB.
- **Lint** ([skill](./skills/lint/SKILL.md)) — periodic health check:
  broken/missing links, orphan pages, contradictions, stale claims, frontmatter
  floor violations. Lint also refreshes the inferred section of `kb-card.md`.

## kb-card.md

The repo-root [kb-card.md](./kb-card.md) describes this KB the way a model
card describes a model — and it is this KB's **discovery interface**: when
introducing this KB to another system or agent (an org context hub, a
crawler, a teammate's agent), hand over the card first. Companies with many
KB repos find and judge them by their cards (fixed filename, machine-first
frontmatter, lint-refreshed health). Humans maintain the small declared
core (name, scope, owning team, `external_sources` — domain-relevant
references that live outside this repo); **lint computes the inferred
traits** (page/type census, freshness, link health). Never hand-edit the
inferred block; it sits between `<!-- BEGIN kb-card:inferred -->` and
`<!-- END kb-card:inferred -->` markers.
Spec: [docs/kb-card-spec.md](./docs/kb-card-spec.md).

## Customizing the kit

The machinery is yours to customize — but **every machinery change must
append an entry to [pattern-log.md](./pattern-log.md)** in the same change,
the way KB edits append to `kb/_log.md`. "Machinery" means anything outside
`kb/` content: site files, skills, scripts, workflows, this file, plus
structural conventions. Tag entries `fork |` in a fork (`upstream |` only in
kb-kit itself) and never edit or remove entries you didn't write.

Why this matters: upstream kb-kit keeps improving after you fork. A planned
upgrade skill will compare the two pattern logs and recommend, change by
change, which upstream improvements to pull in — impossible to do safely if
your customizations aren't on the record (a blind merge would squash them
and ruin post-fork content).

## Conduct

- Propose, don't silently mutate: destructive operations (deleting pages,
  restructuring folders) get discussed first.
- Never edit raw quoted source material — including anything in
  `kb/sources/raw/`; corrections go alongside, attributed.
- Naming: one topic per file, lowercase-hyphenated filenames.
- User-facing copy (site pages, README) stays educational and descriptive —
  explain how things work; never promotional language.
- After editing `kb/`, run `node scripts/build-index.mjs` and commit the
  regenerated `assets/data/*.json` with your change — the site deploys
  straight from the branch, so the committed JSON is what search serves.
  (A CI workflow rebuilds it on `main` as a backstop if you forget.)
- `meta/` (upstream kit development only) is out of bounds for KB workflows;
  when working *on the kit itself* — changing machinery, docs, or site —
  read [meta/AGENTS.md](./meta/AGENTS.md) first (build processes, PRD,
  ADRs, tone rules, pending work).
