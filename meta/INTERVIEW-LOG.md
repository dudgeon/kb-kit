# Interview Log (temporary — delete before release)

Running log of questions asked of the maintainer and their answers, kept so the
parallel agent working on `main` can compare notes.

Agent: session working on branch `claude/kb-starter-kit-2wh4pk`
Started: 2026-07-18

---

## Q&A

### Q1 — How deep should the KB structure go? (2026-07-18)

Options offered: (a) middle path — OKF floor + starter type templates;
(b) full brainkit-style graph; (c) OKF minimal.

**A:** Start minimal and only build up as needed — KBs should "grow" their
typing and opinionation via ingestion and linting. But the reference kit must
ship a **setup/onboarding skill** that: deletes the reference KB content,
interviews the new KB owner about their needs (the repo is designed to be
forked), and adds types as needed. The infrastructure for typing should exist,
but typing itself stays minimal; any typing added for illustrative purposes
must be catalogued and removable via the setup skill.

### Q2 — Schema file: AGENTS.md-canonical or CLAUDE.md-canonical? (2026-07-18)

**A:** Follow the agent-agnostic best practice — AGENTS.md canonical with
CLAUDE.md as a thin shim — and the same for skills (agent-agnostic skill
layout per the open Agent Skills spec, e.g. skills/ referenced from AGENTS.md
with per-tool discovery shims like .claude/skills as needed).

## Research notes / decisions pending interview

- Repo was near-empty at session start (README only); `main` and
  `claude-initial-research` identical to this branch's base. No other-agent
  activity observed yet.
- Research complete → see `research/` (OKF spec, Karpathy gist, brainkit/duo,
  landscape survey) and `PLAN.md` for defaults + open questions.
- Key research findings shaping questions:
  - Google OKF v0.1: `type` is the only required frontmatter field; reserves
    `index.md`/`log.md`; md links only (absolute-from-bundle-root "recommended"
    but breaks GitHub rendering; relative is valid → we choose relative).
  - duo's OKF flavor now defaults `_index.md`/`_log.md` (Google reserves the
    non-underscore names) — candidate compat PR back to duo.
  - No adopted "KB card" standard exists (mid-2026) — kb-card is a real gap;
    nearest analogs: OKF frontmatter, SKILL.md metadata, MCP registry
    server.json, model/data cards.

### Q3 — Repo layout: where does the knowledge live? (2026-07-18)

Options: (a) `kb/` subfolder; (b) `knowledge/` (brainkit match); (c) repo root
as bundle.

**A:** (a) — `kb/` subfolder is the bundle root (`kb/index.md` carries
okf_version); kit machinery (site, README, kb-card.md, skills, actions) at repo
root. Process note: maintainer wants AskUserQuestion used for this type of
multiple-choice question going forward.

### Q4 — Which skills ship? (2026-07-18)

Options: core four (setup/ingest/query/lint) + sync; core four only; core four
+ sync + dedicated card skill.

**A:** Core four only. kb-card updating happens as part of linting (when there
are substantial changes) and during setup. No sync skill for now.

### Q5 — kb-card ambition (2026-07-18)

Multi-select over: taxonomy self-assessment, crawler/discovery affordances,
auto-computed stats, keep minimal.

**A:** Mandatory minimal core including scope and owning team; PLUS optional
additional traits (e.g. typed-entity census, taxonomy assessment) — and these
optional traits must be **inferred from linting analysis, not declared by the
user**. (So: humans author the small descriptive core; lint computes the rest.)

### Q6 — Pages site architecture (2026-07-18)

Options: (a) client-side app + Action-built JSON; (b) full static pre-render;
(c) hybrid.

**A:** (a), with specifics:
- Required site elements: search-forward home page; the customer-success/
  educational-oriented index root (marketing page); a search results page; an
  entity-class (type) overview page; and a note page template.
- Explicitly NOT an SSG — no html twin per md file. Navigating to a kb md
  renders its contents into the html template client-side, with affordances:
  button/link to the canonical md on GitHub, button to open an issue / draft a
  PR relative to that page, etc.
- The html files must be really well documented and agent-friendly, so a user
  (and their agent) can easily imagine what the page could become and customize
  it without breaking things.

### Q7 — Placeholder KB scope (2026-07-18)

Proposed ~18–22 pages from the landscape research (topics, standards, tools,
plus demo decision/source entities, index + log).

**A:** Scope approved, plus:
- Scrape and ingest three X threads (and read for ideas worth adopting):
  - https://x.com/prukalpa/status/2077772169455530152
  - https://x.com/bracesproul/status/2072375136368660515
  - https://x.com/cerebras/status/2077822555159945507
- New structural rule: root `meta/` folder holds everything related to
  *building this project* (ADRs, plan, research, this log, and a CLAUDE.md for
  build-oriented sessions). Everything outside `meta/` is for future users of
  the kit.
- **Deliberate OKF deviation:** maintainer prefers `_index.md` (wrote
  "_index.html", clearly meaning the index file) over Google-reserved
  `index.md`, so the index sorts first in file navigators. (Matches duo's
  ENH-245 default; we assume paired `_log.md` per duo's never-mixed rule —
  to confirm.) Document this as an explicit deviation in the kit.

### Q8 — Housekeeping: _log.md, license, marketing tone (2026-07-18)

**A:**
1. Yes — `_log.md` pairs with `_index.md`.
2. License: corporate-friendly, no restrictions on company adoption;
   attribution would be nice → MIT chosen.
3. Marketing tone approved: educational, PM-first, vendor-neutral,
   fork-in-minutes CTA, links into the live demo KB.

### Q9 — Agent-managed boundary (2026-07-18, maintainer directive, unprompted)

**A:** The `kb/` folder is agent-managed. Content at the repo root and in
non-`kb/` subfolders is **not** agent-managed, but **should be included in
query scope**. Linting and ingest may *propose* changes to the non-kb
structure, but this is a governed process — non-kb content is assumed to be
authoritative and less volatile. (Encoded in ADR 007, AGENTS.md, and the
query/ingest/lint skills.)

### Q10 — Pages deployment mechanism (2026-07-18, maintainer directive, unprompted)

**A:** Target users can only use **branch-deployed** GitHub Pages — the
"GitHub Actions" Pages source is unavailable to them; Actions are allowed for
CI only, and their Pages config is strict (don't forget a `.nojekyll` file).
Because the kit is meant to be cloned by those users, the upstream repo must
follow the same approach. **A firm requirement.** (Encoded in ADR 008;
pages.yml replaced by a CI index-rebuild workflow.)

### Q11 — KB home: honest search, clone-to-query CTA, inbox flow (2026-07-18, maintainer notes)

**A (four notes, verbatim intent):** On the KB home (`knowledge-base.html#/`):
(1) note that site search is basic — keyword only; (2) for more sophisticated
searches users should clone the repo and use the query skill; (3) since many
users won't know how, provide a copyable code block with a single terminal
command that clones the repo, cds into it, and runs `claude /query`; (4) the
pages should explain explicitly how information flows into the KB **via the
inbox and ingest**. The inbox did not previously exist as a convention — it
is established as `kb/inbox/` (ADR 009): a drop folder the ingest skill
sweeps and empties.

### Q12 — Inbox disposal: move, don't delete (2026-07-18)

Agent surfaced that the Karpathy gist has a permanent raw-sources layer but
no queue (processing state must be computed from the log), while the first
inbox implementation had a queue but destroyed originals. Maintainer
confirmed the synthesis:

**A:** There should be a `kb/inbox/` folder which indicates *unprocessed*;
the act of ingesting should **move** items elsewhere (not delete them).
Implemented as: `kb/inbox/` = queue (presence means unprocessed),
`kb/sources/raw/` = immutable archive of processed originals (Karpathy's
layer 1), with the distilled source page linking its archived original.
Location encodes state at both ends; neither folder is search-indexed.

### Q13 — Raw-archive licensing (2026-07-18)

**A:** Not worried about licensing implications of archiving freely
available content — "seems well covered under fair use." The ingest skill's
flag-before-archiving tripwire was removed; agents archive inbox originals
unconditionally.

### Q14 — Pattern log + future upgrade skill (2026-07-18, queued directive)

**A (paraphrased from maintainer):** The agent instructions should require
keeping/adding to a log of changes to the forked *pattern* (the kit
machinery), so that a future skill can check upstream kb-kit and
**nondeterministically** (agent judgment, not mechanical merge) recommend to
a fork owner which subsequent upstream upgrades to pull in. A plain
rebase/merge is off the table — it would ruin content added post-fork — and
customizations must never be squashed.

Implementation note: maintainer said "the Claude.md should instruct," but
per locked Q2 (AGENTS.md canonical, CLAUDE.md thin shim) the instruction
lives in AGENTS.md, which every CLAUDE.md reader reaches. Mechanism:
root `pattern-log.md` (`upstream |` entries in kb-kit itself; forks add
`fork |` entries and a fork-point anchor recorded by setup). The upgrade
skill itself is QUEUED — see ADR 010 and meta/HANDOFF.md.

### Q15 — Scheduled lint REJECTED; local-agent-only constraint (2026-07-18, AskUserQuestion)

**A:** "I don't understand this suggestion; linting requires a strong
generative model, which gh does not have access to; this pattern needs to
work for users/fork owners who only have claude code and cannot access
deployed agents, background headless processes, etc."

Ruling absorbed as a load-bearing constraint: **the kit may not depend on
server-side, scheduled, or headless agents.** Everything agentic runs in the
fork owner's own local agent session (Claude Code or equivalent). CI may run
only deterministic scripts (build-index, lint-kb mechanical checks) — no
model calls. The editorial lint passes remain a human-triggered skill.

### Q16 — Site search scope: index everything (2026-07-18, AskUserQuestion)

**A:** "can we just index all md and html in the repo?" → Yes. Build now
indexes every repo .md plus index.html/knowledge-base.html; exclusions:
`kb/inbox/`, `kb/sources/raw/` (raw material), `meta/` (deleted
pre-release), dot-folders. Non-kb pages carry no `type` (searchable, never
in type views); the home "recently updated" feed stays kb-only. Correction
recorded: the question's premise was wrong — `docs/` was already indexed
via EXTRA_DOCS; the directive generalizes it.

### Q17 — kb-card site URL (2026-07-18, AskUserQuestion)

**A:** Declare the canonical custom-domain URL. `entry_points.site` is now
`https://dudgeon.org/kb-kit/knowledge-base.html` (the account-level custom
domain; the github.io URL 301s there). kb-card interview: maintainer chose
"Later" — stays queued.

### Q18 — Site voice: educational, not salesy; keep the about page current (2026-07-19)

**A (general feedback, maintainer):** index.html is "too salesy in the use
of language, and not descriptive enough about how the kit works, what it is
comprised of, which standards/approaches/lineage it adheres to" — and
AGENTS.md should keep this up to date as the kit evolves. "I don't want to
have to reinforce this again." → Encoded as a standing voice rule in
AGENTS.md ("Writing for the kit's surfaces") + PLAN.md product principles;
ADR 011. A decision playground for candidate voice directions was built at
`meta/study-about-voice/` — the index.html rewrite follows the picks.

### Q19 — KB home: live search, storytelling, educational intake (2026-07-19)

**A (maintainer, generalized):** (1) live-site search "appears broken — does
not respond to keystroke entries" → root cause: search fired only on Enter
with no as-you-type feedback; fixed with debounced live search. (2) The home
needs storytelling: many users interact with the repo directly — cloning it,
via their agent, RAG workflows, or MCP — while the KB home is the quick
browse/basic-search surface, especially for casual users. (3) "How knowledge
gets in" was descriptive, must be *educational*: how to add to the inbox,
open an issue (with link), then either run ingest or wait for a maintainer
pass — **ingest scans issues as it scans the inbox and the current
session**; common usage is an interactive session then "/ingest this".
(4) "Start here" cards were "bad — not logical starting points" → replaced
with task-oriented sections. ADR 012 covers the intake channels.

### Q20 — kb-card vision: context hub, crawler, external sources (2026-07-19)

**A (maintainer, near verbatim):** Companies will have many KB repos; some
part of daily team routine, others hard to find and understand. kb-card
lets companies build systems (or just use agents) to scan repos and find
context KBs — AGENTS.md should also point to the kb-card. Foreseen system:
users manually onboard a knowledge repo to a "context hub"; it becomes
indexed and searchable, and linting operations consider the contents of
adjacent repos. Subsequent step: a crawler fans out across the company's
full GitHub instance and finds KBs by their kb-card, *automatically*
pulling them into the KB universe. Also: not all knowledge lives in
GitHub — a KB should, for its domain, point to relevant external sources,
and those references can be added to the kb-card too. → ADR 013; spec +
demo card updated; interview-prep doc updated (parts of Q2/Q5 now answered).

### Pending interview: the kb-card concept (queued 2026-07-18)

Maintainer: "I think we could better explain the kb-card concept — that
could be an oppty for you to interview me in the future." Prep doc with
proposed questions: [kb-card-interview-prep.md](./kb-card-interview-prep.md).
Ask ONE question at a time (working agreement) when the maintainer is next
available.

### Interview status

Core decisions locked; build phase begins. Remaining choices (folder
categories, pill design details, exact type set for demo content) made
autonomously by the build agent and recorded in meta/ ADRs.

### Incident — 2026-07-18: unflagged retrieval failure

Maintainer flagged (correctly) that the Cerebras article scrape failure was
not surfaced in chat when research was reported — the caveat existed in the
KB page and research notes but the chat summary presented findings as if
retrieval succeeded. Corrections: (1) `retrieval:` frontmatter key added to
secondary-sourced pages (cerebras, prukalpa); (2) ingest skill now REQUIRES
retrieval failures to be stated in the report to the human AND recorded in
frontmatter; (3) re-fetch attempted from main context — cerebras.ai is 403
at the proxy on all paths; article remains unretrievable from this
environment. Rule going forward: evidence problems lead the summary, never
trail it.
