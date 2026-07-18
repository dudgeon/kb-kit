# Research notes: three X posts (maintainer-supplied, 2026-07-18)

Retrieval caveat: x.com and mirrors were egress-blocked; reconstructed via
search snippets + raw.githubusercontent.com. Verbatim only where marked. All
three are part of the same July-2026 convergence on markdown-in-git KBs
catalyzed by OKF v0.1 and the LLM-wiki wave; two posted the same day.

## 1. @prukalpa — "The GitHub for Context Doesn't Exist Yet" (2026-07-16)

Prukalpa Sankar (Atlan co-CEO, "Context & Chaos" Substack). Post announces the
essay https://contextandchaos.substack.com/p/the-github-for-context-doesnt-exist
(reconstructed):
- Anecdote (AI Engineer World's Fair 2026): building an agent took ~5 min;
  giving it business context "took forever." One company burned through five
  agent stacks in twelve months — each migration stranded the context that
  made the agents useful.
- Thesis: **"The agent layer is becoming disposable, but a company's context
  is not — yet most tools still bind the two together."**
- "Performance is intelligence times context, and the relationship is
  **multiplicative**."
- SWE parallel: git gave code diffs; industrial software also needed review,
  ownership, CI, dependency mgmt, registries, observability. Today "**context
  has diffs**" but not the rest.
- Prescriptions: every **"unit of context"** needs a GitHub-like profile —
  owner, approvers, maintainers, scope, provenance, declared dependencies.
  Local vs company-wide context stay distinct (marketing and finance can
  legitimately define the same term differently). The missing thing is an
  **operating layer treating context as durable infrastructure**, not
  agent-specific configuration. Invert the architecture: domain experts encode
  knowledge into shared skills in one "company brain."
- Relevance: manifesto for context repos + strong external validation of
  kb-card (her "profile for a unit of context" ≈ our card).

## 2. @bracesproul — Introducing OpenWiki (2026-07-01, X Article)

Brace Sproul (Head of Applied AI, LangChain). Companion tweet (verbatim):
"Excited to release OpenWiki! OpenWiki is the easiest way to generate and
maintain documentation in your codebase, built specifically for agents to
consume. Get started with a single command: `openwiki --init`"

Repo github.com/langchain-ai/openwiki (fetched):
- CLI, two modes: **code brain** (repo docs into `openwiki/`) and **personal
  brain** (`~/.openwiki/wiki` from connectors: repos, Gmail, Notion, Slack,
  web search, HN, X).
- CI keeps docs fresh: daily PR via `openwiki --update` (GH Actions etc.).
- **Emits Google OKF v0.1 bundles in both modes** (frontmatter `type`,
  reserved index.md/log.md, root okf_version, md links). Brace announced OKF
  adoption 2026-07-16 (status 2077799633640919208).
- Built on LangChain's open deepagents harness.
- Follow-on: **OpenWiki Brains 0.1.0** (2026-07-10) — "proactive memory":
  agents build memories by fetching context rather than waiting to be told.
  https://www.langchain.com/blog/introducing-openwiki-brains-general-purpose-wiki-memory-for-agents
- Relevance: reference OSS implementation of agent-maintained wiki-as-KB;
  first major OKF producer.

## 3. @cerebras — "How We Built Our Knowledge Base" (2026-07-16)

Corporate post promoting https://www.cerebras.ai/blog/how-we-built-our-knowledge-base
(blog itself egress-blocked; only 2 days old). Establishable: first-party
account of an internal, agent-queried company KB; employees query it **15,000+
times** (period unknown); ~1.1M views on the post (unverified). Authors:
@hi_im_isaac_, @learnwdaniel, @gaozenghao. Search context ties it to the
LLM-wiki pattern (hybrid SQLite FTS5 + local embeddings, CLI + MCP exposure)
but techniques unconfirmed. Re-fetch from an unrestricted network later.

## Cross-cutting

1. Files-in-git as substrate — "context has diffs."
2. OKF as interop layer; completes a protocol triad (MCP = tool access, A2A =
   agent-to-agent, OKF = what the agent knows). OpenWiki adopted; catalog
   vendors (Atlan, Alation, Collate) watched.
3. Prukalpa names the open gap: governance layer (ownership, review,
   dependencies, provenance, registries) — kb-card territory.
4. Decoupling thesis: agents are disposable, context is durable — the
   strongest argument for standalone context repos.
