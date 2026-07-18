# Research notes: Karpathy's "LLM Wiki" gist

Source: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
(`llm-wiki.md`, shared April 2026; ~5k+ stars, 40+ comments as of 2026-07).

## The pattern

An "idea file" meant to be pasted to your own agent: instead of RAG retrieval at
query time, "the LLM **incrementally builds and maintains a persistent wiki** — a
structured, interlinked collection of markdown files that sits between you and
the raw sources." A "persistent, compounding artifact."

**Three layers** (verbatim):
1. **Raw sources** — "your curated collection of source documents... These are
   immutable — the LLM reads from them but never modifies them. This is your
   source of truth."
2. **The wiki** — "a directory of LLM-generated markdown files... The LLM owns
   this layer entirely... You read it; the LLM writes it."
3. **The schema** — "a document (e.g. CLAUDE.md for Claude Code or AGENTS.md for
   Codex) that tells the LLM how the wiki is structured, what the conventions
   are, and what workflows to follow when ingesting sources, answering
   questions, or maintaining the wiki." Co-evolves with the domain.

**Three operations**:
- **Ingest** — read source, discuss takeaways, write summary page, update index
  + affected entity/concept pages ("a single source might touch 10-15 wiki pages").
- **Query** — read `index.md` first, synthesize cited answers; "Good answers can
  be filed back into the wiki as new pages."
- **Lint** — periodic health check: contradictions, stale claims, orphan pages,
  missing cross-references, gaps; suggest new questions/sources.

**Files**: `index.md` (content catalog, updated every ingest; substitutes for
RAG infra to ~100 sources / hundreds of pages), `log.md` (append-only;
"`## [2026-04-02] ingest | Article Title`" prefix convention), YAML frontmatter,
`[[wikilinks]]` as graph edges, no prescribed directory tree (deliberately
abstract: "It describes the idea, not a specific implementation").

**Tooling**: Obsidian as IDE (Web Clipper, graph view, Dataview), git ("just a
git repo of markdown files").

## Philosophy

- "The tedious part of maintaining a knowledge base is not the reading or the
  thinking — it's the bookkeeping... LLMs don't get bored, don't forget to
  update a cross-reference, and can touch 15 files in one pass."
- Humans curate sources + ask questions; LLM does everything else.
- "your explorations compound in the knowledge base."
- Memex lineage (Vannevar Bush, 1945): private, curated, links-as-value.
- "Pick what's useful, ignore what isn't."

## Notable comment threads

- **phoebe22222** (prod infra-ops wiki, ~4,000 concepts): "The schema file is
  everything"; drift (silent staleness from missed cross-reference updates) is
  the top failure mode — "the lint pass is *not* optional"; past a few hundred
  pages, replaced flat index with SQLite FTS5 + local embeddings hybrid search;
  new-page-vs-edit heuristic works "~90% of the time once the schema enumerates
  the page types"; team sharing = private git repo + Obsidian or MCP server.
- **bluejaeha**: verification-status metadata (unverified → verified) to prevent
  circular evidence chains.
- **pradocabreroalejandro**: deterministic "distillation contracts," provenance
  headers, trust-floor annotations (human-verified vs machine-hinted).
- **gserdyuk**: "document passports" (immutable header defining a file's
  regime); corpus/surface split for staleness.
- **simontaurus**: structured entities + write-time dedup; entity resolution is
  the hard part.
- **DaveMikeP** (critique): filing LLM answers back can add no genuine
  information; prefers output-only artifacts.
- Recurring themes: schema ownership matters; lint automation prevents rot;
  git-backed review gates; local-first privacy; compounding requires disciplined
  maintenance, not accumulation.

## kb-kit deviations from the gist

- Markdown links, not `[[wikilinks]]` (per Google OKF + GitHub rendering).
- We *do* prescribe a baseline directory tree and frontmatter floor (the gist is
  deliberately abstract; a forkable kit needs concrete defaults).
- Lint/"distill" shipped as an agent-agnostic skill, plus CI checks.
