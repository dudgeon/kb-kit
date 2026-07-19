---
name: setup
description: Onboard a fresh fork of kb-kit — interview the new KB owner, clear the demo content, install the types they actually need, and write their kb-card. Use when a user says they just forked kb-kit, wants to start their own knowledge base, or asks to reset/initialize this KB.
---

# setup — turn the demo into *their* KB

You are onboarding a new knowledge-base owner, probably a product manager,
possibly non-technical. Be conversational; ask **one question at a time**;
never assume git fluency.

## Step 1 — interview

Learn, in roughly this order:

1. What the KB is about, in one sentence (→ card `description`).
2. What's explicitly out of scope (→ card `scope`).
3. Who owns it — team name, contact channel (→ `owner`, `contact`).
4. Who it serves (→ `audience`) and whether it's public/internal (→ `access`).
5. What they'll ingest first — meeting notes? research? specs? competitor
   intel? This drives Step 3's type choices.
6. GitHub Pages URL if known (`https://<user>.github.io/<repo>/`) for
   `entry_points.site`.

## Step 2 — clear the demo content

The demo KB is a survey of the context-management landscape. Removal list —
delete these entirely (confirm with the owner first; offer to keep the
landscape KB in a branch or an `archive/` folder if they find it useful):

- All pages under `kb/topics/`, `kb/standards/`, `kb/tools/`, `kb/sources/`,
  `kb/decisions/` (the folders themselves may stay if the owner will use
  them).
- Any stray items in `kb/inbox/` and demo originals in `kb/sources/raw/` —
  but keep both folders and their `_index.md` files; the inbox (queue) and
  raw archive are machinery.
- All entries in `kb/_log.md` (restart the log with a `setup` entry) and all
  demo listings in `kb/_index.md` (keep its frontmatter and structure).

**Demo-only types** (remove `kb/templates/<type>.md` unless the owner wants
them): `standard`, `tool`. **Core types** (keep unless asked): `note`,
`source`, `decision`, `topic`.

Do NOT touch: `AGENTS.md`, `skills/`, `.claude/` (per-tool skill symlinks),
`docs/`, `scripts/`, the site files (`index.html`, `knowledge-base.html`,
`assets/`, `.github/`) — those are machinery, not content. `meta/`, if
present, is upstream-development residue: offer to delete it.

## Step 3 — fit the types

Map the owner's answers to the smallest workable type set. Bias hard toward
fewer: `note` + `source` is a fine start; add a type only when they name a
recurring shape ("we log a lot of decisions" → keep `decision`). For each new
type: create `kb/templates/<type>.md` (frontmatter `type`, `summary`,
optional `statuses`) + a line in `kb/templates/_index.md`. Remind them types
can grow later via ingest/lint — nothing is final today.

## Step 4 — write their kb-card and finish

1. Rewrite `kb-card.md` from the interview (spec:
   `docs/kb-card-spec.md`). Leave the inferred block as "not yet linted."
2. Rewrite `kb/_index.md` sections to match the chosen types/folders; seed a
   first page if the owner dictated one.
3. Reset `kb/_log.md` with a dated `setup` entry recording what was removed
   and which types were installed.
4. Update the README title/description to their KB's name, and point them at:
   enabling GitHub Pages (Settings → Pages → Source: **Deploy from a branch**
   → `main`, `/ (root)`; the root `.nojekyll` file must stay) and the ingest
   skill for their first real source.
