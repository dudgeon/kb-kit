# NEXT.md — plan for the post-redesign backlog

Written 2026-07-19, at the merge of the field-manual redesign
([PR #3](https://github.com/dudgeon/kb-kit/pull/3), ADR 015). This is the
plan for the five backlog items that were named but not built in that PR.
[HANDOFF.md](./HANDOFF.md) tracks session state; this file is the plan.
Items are ordered by recommended sequence, not priority alone.

Options within an item are lettered a/b/c with a **recommendation**;
decisions marked **ASK** are the maintainer's to make (phone-friendly,
one question at a time — working agreement).

---

## Item 3 — Reserved-type glyphs + dead-CSS cleanup (do first: cheapest, same files)

The independent review of the redesign confirmed 8 non-regressions (logged
in HANDOFF.md "Discovered but not fixed"). None was introduced by the
redesign; all are worth clearing while `site.css`/`views.js` are fresh.

**3a. Reserved types render pill-less.** `typePill()` in
[assets/js/views.js](../assets/js/views.js) builds `pill pill-type-<type>`
for whatever a page declares, including the three reserved system types
`index`, `log`, `kb-card`; [assets/css/site.css](../assets/css/site.css)
only defines `::before` glyphs for the six content types
(note/topic/source/decision/standard/tool). Consistent with the documented
fallback ("unknown types render as a plain monochrome pill, no glyph"), so
this is a polish call, not a bug.
- a. **(recommended)** Add glyph rules for the three reserved types —
  candidates: `index ▪` (or `⊙`), `log ✎`, `kb-card ★`. One CSS block,
  matches the stylesheet's own stated intent that "each type gets a glyph."
- b. Leave as-is; the plain pill is a fine signal that these are system,
  not content, pages.
- **Recommend a** — the `kb-card` pill is currently the #1 item on the KB
  home's "Recently updated" list, so the gap is visible on the front page.

**3b. Prune dead CSS** (defined, referenced nowhere): `.card .card-path`,
`.btn-primary` / `.btn-primary:hover`, `.kb-main-wide`. Delete outright.
Keep `.visually-hidden` (a standard a11y utility worth having on hand) but
that's a judgment call — **ASK** only if you'd rather remove it too.
`.kb-results` (plural, unstyled wrapper): leave the class as a DOM hook or
delete the class from `views.js`; harmless either way.

**Files:** `assets/css/site.css`, maybe `assets/js/views.js` (only if
removing `.kb-results`). No JSON rebuild (no `kb/` change). Pattern-log
entry required (machinery change). **Effort: ~30 min.**

---

## Item 2 — Educational KB-home (mockup 3a: type rows + log-sourced changes)

Two `views.js` `renderHome()` changes from the design doc's mockup 3a,
deferred out of the redesign so they get their own build+verify pass. A
task chip already exists for this.

**2a. Browse-by-type as educational rows** — replace the pill row with a
grid: glyph + type name + one-line description + page count, each linking
to `#/type/<type>`. Mockup grid was `150px name / 1fr description / 40px
count`, hairline row borders.
- Description source:
  - a. **(recommended)** Read each type's `summary` frontmatter from
    `kb/templates/<type>.md` — already in the manifest, so forks inherit
    their own descriptions automatically (same pattern the masthead uses
    to pull name/description from the kb-card). Generic and fork-safe.
  - b. Hand-author demo-specific descriptions in `views.js` (matches the
    mockup's exact wording, e.g. "subjects the KB covers, one page each"),
    but a fork would have to rewrite them.
  - **Recommend a** for the fork-inheritance property; the template
    summaries read well enough as-is.
- Glyph source: reuse the CSS `::before` glyphs, or duplicate a
  glyph→type map in JS. **Recommend** a small JS map (the CSS `content`
  values aren't readable from JS cleanly).

**2b. "Recently changed" from `kb/_log.md`** — the mockup showed date +
page + what-changed sentence, sourced from the change log, instead of the
current manifest `modified`-date feed.
- **ASK** — this is a genuine product choice:
  - a. Keep the current manifest-`modified` feed (page title + summary,
    links to the page). Simple, already works, no parsing.
  - b. Switch to parsing `kb/_log.md` `## YYYY-MM-DD` entries for the
    editorial "what changed" text. Richer, but couples the home view to
    the log's prose format and needs a small parser + fallback.
  - **Recommend a** unless you specifically want the editorial voice on
    the home page; the manifest feed is more robust and needs no new code.

**Files:** `assets/js/views.js`, `assets/css/site.css` (new row styles),
`assets/data/*.json` only if 2b changes indexing (it won't). Pattern-log
entry. Browser-verify (light/dark/mobile). **Effort: ~1–2 h**, most of it
2a. Do after Item 3 (shared files, shared verify pass).

---

## Item 4 — Setup-skill dry run (verify against the redesign)

Simulate a fork onboarding end to end and confirm
[skills/setup/SKILL.md](../skills/setup/SKILL.md) still matches reality
after the redesign.

- The demo-removal list is `kb/`-scoped and treats the site
  (`index.html`, `knowledge-base.html`, `assets/`) as machinery to leave
  alone — so the redesign didn't invalidate the removal list itself.
- **Check specifically:** any place the skill tells the owner to rewrite
  `index.html` copy — the section structure changed (hero + artifact card,
  "How it works" rows, file tree, terminal steps, taxonomy; the old "Why
  now" / feature-grid / 5-step sections are gone). If the skill names
  sections or hero copy, update the guidance to the new structure.
- Confirm the `standard`/`tool` demo-type removal + `kb/templates/_index.md`
  line removal still lints clean.

**Files:** likely `skills/setup/SKILL.md` (guidance only). Pattern-log
entry if the skill changes. **Effort: ~45 min.** Independent of 2/3.

---

## Item 5 — Build the `upgrade` skill (ADR 010, Q14 — queued)

The largest item; fully specified in
[ADR 010](./adr/010-pattern-log-and-upgrade-skill.md). Build
`skills/upgrade/SKILL.md` (agent-agnostic, like the other four skills). It
must:

1. Fetch upstream `pattern-log.md` (raw GitHub URL for
   `dudgeon/kb-kit@main`).
2. Read the fork's `fork-point |` anchor entry (written by setup) to know
   the baseline commit/date.
3. Diff upstream entries since the fork-point against the fork's copy;
   cross-reference the fork's own `fork |` entries for collisions.
4. **Recommend per change, with judgment** — adopt / adapt / skip — and
   propose patches. Never blind-merge. The fork owner decides each.

**Prerequisites / open questions:**
- **ASK** delivery shape: (a) the skill emits a report the owner reads and
  applies manually; (b) it opens a branch + PR per adopted change; (c) it
  applies to the working tree and lets the owner review the diff.
  **Recommend a** for the first version — a judgment report is the safe,
  reviewable MVP; automate application later.
- Depends on the ledger discipline already in place (it is) and a
  `fork-point` anchor existing (setup writes it; a real test needs a real
  fork, or a simulated fork-point entry).
- Add a `skills/upgrade/` entry to any skill index and the setup
  do-not-touch list. Pattern-log entry required.

**Files:** `skills/upgrade/SKILL.md` (+ symlink into `.claude/skills/` per
the repo convention), `pattern-log.md`, possibly `AGENTS.md` (mention the
skill). **Effort: half a day.** Independent; can slot any time.

---

## Item 6 — kb-card concept interview (maintainer-gated, async)

Queued since 2026-07-18. Prep + question list in
[kb-card-interview-prep.md](./kb-card-interview-prep.md). Conduct **one
question at a time** (working agreement) when the maintainer is available;
log each answer verbatim-ish in [INTERVIEW-LOG.md](./INTERVIEW-LOG.md),
turn non-obvious decisions into ADRs. Not a sit-down task — it runs in the
background of other work. **Effort: async / maintainer-paced.**

---

## Suggested sequence

1. **Item 3** (30 min) — clears the review findings while the CSS is fresh.
2. **Item 2** (1–2 h) — same files, one shared verify pass with Item 3.
3. **Item 4** (45 min) — quick verification the redesign didn't strand the
   setup skill.
4. **Item 5** (half day) — the upgrade skill, whenever there's a longer block.
5. **Item 6** — start whenever the maintainer has a spare phone moment.

Items 3+2 pair naturally (shared files); 4 and 5 are independent; 6 is
async. Each item ends with `node scripts/lint-kb.mjs`, a pattern-log entry
for any machinery change, and browser verification for any site change —
per meta/AGENTS.md norms.
