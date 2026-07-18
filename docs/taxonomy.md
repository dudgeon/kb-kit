# What makes a great context repo

A taxonomy of quality for knowledge bases that humans and agents share. Use it
three ways: as a **checklist** when building, as a **rubric** when linting, and
as a **vocabulary** for the [kb-card](./kb-card-spec.md) — the card's inferred
traits are these dimensions, measured.

Each dimension has three grades: **functional** (works), **good** (compounds),
**great** (discoverable and trustworthy at org scale).

## 1. Scope

Does the KB know what it is about — and what it is not?

- **Functional**: a stated topic; content mostly on-topic.
- **Good**: scope declared in the kb-card; off-scope material is redirected,
  not accumulated; the boundary is a sentence a new teammate could apply.
- **Great**: scope is negotiated with neighboring KBs — overlaps are resolved
  by links to the other KB rather than duplication.

## 2. Structure & navigability

Can a reader — human or agent — get from the front door to any fact in a few
hops?

- **Functional**: an `_index.md` exists and links to most content.
- **Good**: progressive disclosure — every folder has a one-screen index; an
  agent can navigate by reading indexes instead of globbing the tree; folders
  are navigation while frontmatter `type` carries meaning.
- **Great**: multiple deliberate entry paths (index, type overviews, search);
  no page more than ~3 hops from the root; orphan rate ≈ 0.

## 3. Typing & consistency

Is like knowledge shaped alike?

- **Functional**: every page has frontmatter with a `type`.
- **Good**: each type has a template that defines it; types were grown from
  real ingestion needs, not invented up front; status ladders where lifecycle
  matters.
- **Great**: the type census is stable and small; an agent told "add a
  decision" produces a page indistinguishable in shape from the existing ones.

## 4. Linkage

Are relationships explicit?

- **Functional**: pages link to related pages; links resolve.
- **Good**: links assert relationships in prose ("supersedes", "depends on",
  "contradicts"); new pages are linked from the pages that should mention
  them, not just from the index.
- **Great**: dense enough that any query can be answered by following links
  from one entry point; broken links only ever mean "not yet written."

## 5. Provenance & trust

Can every claim be traced?

- **Functional**: pages say where their content came from.
- **Good**: the frontmatter `source` floor is enforced; verbatim source
  material is preserved and never edited; LLM-inferred content is marked as
  such (`source: unverified` until a human confirms).
- **Great**: claims carry citations a reader can check in one click;
  contradiction between sources is surfaced as content, not silently resolved;
  circular evidence (a KB page citing a KB page citing nothing) can't survive
  a lint pass.

## 6. Freshness & maintenance

Does the KB decay or compound?

- **Functional**: someone updates it when they remember to.
- **Good**: `_log.md` shows a heartbeat; ingest updates every affected page
  (not just the new one); stale claims are dated so staleness is visible.
- **Great**: lint runs on a schedule; drift (the silent divergence of
  cross-references from reality) is caught by process, not by accident;
  freshness is measured on the card, not asserted.

## 7. Agent-readiness

Can an agent be dropped in cold and be useful in one session?

- **Functional**: an AGENTS.md (or equivalent) exists.
- **Good**: the schema file states the conventions and the workflows
  (ingest/query/lint) concretely; frontmatter is machine-parseable; no
  format that requires bespoke tooling to read.
- **Great**: the schema file co-evolves with the KB and is itself
  version-controlled and reviewed; an agent's output is checked by lint
  against the same rules the schema states; context cost is managed —
  indexes stay one screen, pages stay one topic.

## 8. Human experience

Do the people who don't clone repos still get value?

- **Functional**: readable markdown on GitHub.
- **Good**: a browsable site with search; pages render well; humans can reach
  the canonical file and propose changes without knowing git.
- **Great**: the KB is where the team actually looks things up — the site,
  the editor (e.g. Obsidian), and the agent all read the same files and none
  is second-class.

## 9. Discoverability

Can someone outside the team find this KB and judge it without reading it?

- **Functional**: a README says what the repo is.
- **Great** (this one skips "good" — it's binary in practice): a `kb-card.md`
  at the repo root with the standard declared core, refreshed inferred traits,
  and a stable filename an org-wide crawler can find. In a world of hundreds
  of KBs per org, the card *is* the KB's interface.

## 10. Governance

Is it clear who decides?

- **Functional**: an owning team is named.
- **Good**: contribution paths differ by weight — small fixes flow (PR or
  agent edit), structural changes are proposed; the KB survives its founder
  leaving.
- **Great**: agents propose rather than silently mutate for anything
  destructive; the git history is a usable audit trail of who/what changed
  each claim and why.

---

### Anti-patterns (fast ways to fail)

- **The dump** — ingestion without curation; a folder of PDFs is not a KB.
- **The shrine** — beautiful structure, no heartbeat; last `_log.md` entry
  three months ago.
- **Premature ontology** — twenty types before ten pages; typing should be
  earned by content ([grown, not designed](./taxonomy.md#3-typing--consistency)).
- **The mirror maze** — the same fact maintained in three places; derived
  views must be regenerated, never hand-synced.
- **Boilerplate context** — verbose schema files that cost more tokens than
  they save; research shows bloated context files can perform worse than none.
- **Wikilink lock-in** — formats only one tool can resolve; portability is the
  point.
