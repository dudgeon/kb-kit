# Research notes: dudgeon/loop-library `dist/brainkit` and dudgeon/duo

Key correction up front: **`dudgeon/duo` is not itself a vault — it's a macOS
Electron app (human+agent pairing workspace) that defines and implements the
"OKF" vault format** (duo's "Open Knowledge Format" — same name as, and aligned
with, Google's OKF; duo's vault mode carries `okf_version: "0.1"`). brainkit's
`knowledge/` folder ships as a valid OKF vault — the bridge between the repos.

## brainkit (v0.3.0, "contract v2")

"A second brain for work that compounds." Layers: **loopkit** (FOUNDATION.md
contract) → **brainkit** (application/policy).

Tree: `README.md`, `CLAUDE.md` (the operating manual — the core convention
doc), `PROJECT.md` (per-fork goal/deliverables/task_policy), `FOUNDATION.md`,
`DESIGN.md`, `MIGRATION.md`, `CHANGELOG.md`, `loop.manifest.json`;
`.claude/skills/{ingest,query,distill,sync}/SKILL.md`;
`knowledge/{index.md, golden/, templates/{decision,meeting,note,person,source,task}.md}`;
`work/{README.md, templates/{best-practices,prd}.template.md}`.

Operations: **ingest → query → distill** (distill = Karpathy's lint) + **sync**
(curates upstream kit updates via `loop.manifest.json` `managed_files`; type
templates are "SEED-ONCE," never sync-managed).

### Conventions

- Frontmatter floor (never ceiling): `summary:`, `type:`, `source:` (provenance
  or `unverified`). Plus typed attributes (`status:`, `due:`, `owner:`,
  `aliases:`). **"Keep frontmatter keys you don't recognize. Never drop a key
  you didn't write"** (load-bearing). `id:` = shared tool-mintable integrity tag
  (8-char base36-ish); links heal by id first, then filename.
- Type templates = prose + minimal frontmatter (`type:`, optional `statuses:`
  ladder, optional `timeline: true`) — not a fields grid. Ladders: source
  `unread→reading→read→processed`; note `draft→solid→canonical`; task
  open/in-progress/blocked/done.
- **Folders derived from the `parent:` edge** (recursive); parentless notes flat
  in type/registry folders. "The graph is the single source of truth; the path
  is a projection of it." Other slices = `index.md` nested-bullet outlines,
  never a second folder tree.
- Naming: one topic per file, lowercase-hyphenated, index.md ≈ one screen.
- **Linking (§5 verbatim):** "Plain relative markdown — `[label](./other-note.md)`.
  Never `[[wikilinks]]`, never absolute `/paths`. (Resolve a quick `[[Name]]`
  gesture to rel-md before saving — nothing with `[[ ]]` lands in a commit.)"
  Edges may carry frontmatter payloads; edges survive a split.
- Entity resolution at intake (AskUserQuestion; aliases recorded on canonical
  note; "Never upgrade a name you can't verify").
- Enrichment: one enriched note per source, verbatim original in `## Raw`,
  extractions become linked note/decision entities.
- Timelines: `timeline: true` types get machine-owned `## Timeline` inside
  `<!-- BEGIN generated:timeline -->` fences; "A fact must never live *only* in
  a timeline."
- `knowledge/golden/`: locked context, loaded first, wins on contradiction;
  promotion phrase "pin this."
- Derived views: `type: index-view` notes, regenerated + stamped, never
  hand-cached. Deliverables in `work/` with per-file `locked: true`.
- `knowledge/index.md` frontmatter: `okf_version: "0.1"`, `type: index`, plus a
  `<!-- duo:listing -->` fence. Duo is "an accelerator... never a dependency."

## duo (the app defining OKF vaults)

macOS Electron/TS app: terminal + browser + file tree + markdown editor, `duo`
CLI so the agent acts on what you see. `core/vault/` engine (~46 files:
detect/filing/listings/graph/corpus/rollup/lint/search...). `skill/` ships
SKILL.md + references (vault.md, rollup.md, cli-reference.md). PRDs as
D-numbered decision ledgers (`docs/prd/enh-208-vault.md`, enh-230, etc.).
`AGENTS.md` is a thin shim: "refer to `CLAUDE.md` as canonical."

### OKF vault conventions (duo flavor)

- Detection: root index carries `okf_version` frontmatter — **`_index.md`
  (ENH-245 new default) OR legacy `index.md`**; `.obsidian/` dir = obsidian
  mode; okf_version wins if both.
- Frontmatter: `type:` (not `class:`); `id:` minted primary key; `title:`;
  `aliases:` (auto-seeded with human title, ENH-266e); entity-reference fields
  are **quoted markdown relative links** — `owner: "[Alice Park](../people/alice-park.md)"`
  (ENH-266, 2026-07-09 — reversed an earlier wikilink decision after Obsidian
  testing showed frontmatter wikilinks create phantom nodes; quoting is
  load-bearing YAML). "The vault IS the schema" — corpus computed live, never
  cached.
- Links: relative md only in prose; `[[ ]]` an input gesture rewritten at rest;
  auto-relink heals by id on vault open; bundles containing `loop.manifest.json`
  (brainkit forks) are never relinked; moves via `duo vault mv`.
- Filing (D19): per-type rule in `templates/<type>.md` — registry folders for
  parentless types; parented types declare one frontmatter attr as filing
  parent; only folder-note types can parent; fallback `notes/YYYY/MM/`; capture
  in `inbox/`; archive to `archive/YYYY/` proposal-only.
- Listings: paired `_index.md` + `_log.md` (underscore default, legacy
  non-underscore honored, never mixed) regenerated below `<!-- duo:listing -->`
  by `duo vault publish`; optional `listing:` BaseDef (Obsidian Bases schema);
  `type: rollup` notes with ```base blocks → rendered artifacts in `output/`
  stamped `last_generated`/`last_hash`.
- Agent posture: CriticMarkup tracked suggestions + dated report note;
  archiving/moves proposal-only.

## Deltas that matter for kb-kit

| Issue | Google OKF v0.1 | brainkit/duo | kb-kit call (pending interview) |
|---|---|---|---|
| Links | absolute `/path.md` "recommended," relative valid | relative only, absolute forbidden | relative (renders on GitHub; conformant) |
| Index filename | reserves `index.md` | duo default `_index.md`, legacy `index.md` honored | `index.md` (conformant + duo-legacy-compatible) |
| Required frontmatter | `type` only | floor: `summary`, `type`, `source` | superset: `type` required, `summary`/`source` recommended |
| Index frontmatter | index.md normally has NONE (root may have okf_version) | brainkit index carries type/title/okf_version | root index.md with okf_version conforms; sub-indexes bare |
| Identity | path = ID | minted `id:` key | optional `id:` (unknown-key-tolerant per spec) |
| log.md | reserved, `## YYYY-MM-DD` headings | duo `_log.md` paired | `log.md` |

Shared invariants across all three: frontmatter-typed entities, markdown links,
preserve unknown keys, single source of truth + regenerated derived views,
aliases for entity resolution, agents propose rather than silently mutate.

Potential upstream PRs to duo (if kit decisions conflict): none strictly forced —
duo already honors legacy `index.md` and relative links. Watch: duo's
`_index.md`/`_log.md` underscore default technically diverges from Google OKF's
reserved names (Google conformance requires `index.md`/`log.md` structure "when
present" — `_index.md` is just a non-reserved... actually an unknown file with
frontmatter would need `type`; duo's `_index.md` carries okf_version but needs a
`type` to be a conformant concept OR should be renamed. Candidate compat PR).
