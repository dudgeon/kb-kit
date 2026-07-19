# Research notes: Context repos & agent knowledge bases — mid-2026 landscape

Seed material for the placeholder KB content. Web-researched 2026-07-18.

## A. Instruction-file standards

### AGENTS.md
Plain-markdown repo-root file giving coding agents project instructions.
Originated by OpenAI (with Google, Cursor, Factory, Sourcegraph); stewarded
since 2025-12-09 by the **Agentic AI Foundation (Linux Foundation)**. De facto
winner: read by ~30 tools (Codex, Copilot, Cursor, Windsurf, Amp, Devin, Aider,
Zed, Jules...), 60k+ repos; one 2026 study: −29% median agent runtime, −17%
output tokens when present. No schema — value is convention + location.
https://agents.md/

### CLAUDE.md + Claude Code memory hierarchy
Anthropic's layered system: enterprise/project/personal CLAUDE.md discovered up
the dir tree + imports; **auto memory** (agent-written MEMORY.md, first 200
lines/25KB auto-loaded). Best practice: ~80–120 high-signal lines,
version-controlled; CLAUDE.md = your requirements, auto memory = what Claude
observed. Coexists with AGENTS.md. https://code.claude.com/docs/en/memory

## B. Skills

### Agent Skills / SKILL.md
Directory with SKILL.md (YAML name/description + instructions) + optional
scripts/templates; progressive disclosure (near-zero tokens until triggered).
Anthropic; open spec at agentskills.io (2025-12-18), Agentic AI Foundation
governance. ~40 products support it (Claude, Codex, Copilot, VS Code, Cursor,
Gemini CLI, Goose...); SkillsMP indexes ~1.9M public skills; SkillsBench: mean
quality 6.2/12, curated skills +16pts pass rate. Skills = "how to do X"
(complementing MCP's "connect to X"). https://agentskills.io/ ·
https://github.com/anthropics/skills

## C. Site/knowledge-level formats

### llms.txt
Root markdown index curating site content for LLMs (Jeremy Howard/Answer.AI,
Sept 2024). ~8.7% of top-1000 sites (2026-06), ~5.6x growth in 12 months,
Shopify platform-wide; but major LLM crawlers still don't reliably fetch it —
real consumers are IDE agents and docs-MCP servers. https://llmstxt.org/

### Google Open Knowledge Format (OKF)
v0.1 draft (2026-06-12): knowledge bundles = markdown concepts + YAML
frontmatter (`type` required), markdown links as relationships, reserved
`index.md`/`log.md`. "Format, not platform." Ships BigQuery enrichment agent,
static HTML graph visualizer, 3 sample bundles. See
[okf-spec-notes.md](./okf-spec-notes.md).

### Karpathy's "LLM Wiki"
April 2026 pattern (see [karpathy-llm-wiki-notes.md](./karpathy-llm-wiki-notes.md)):
agent-maintained compounding markdown wiki replacing per-query RAG. Explicitly
the inspiration OKF standardizes; spawned the Q2-2026 "second brain with Claude
Code" wave.

### Obsidian-vault-as-agent-KB
Community pattern: vault of plain md on local disk as agent memory/inbox/KB,
via direct filesystem access or Obsidian MCP servers; mainstream among
practitioners in 2026. Obsidian supplies human graph view + editing UX; the
folder of .md is agent-native context.

### Meta-repo / codified-context pattern
Dedicated repo as agent orientation guide across multi-repo codebases (hot
constitution + cold on-demand specs behind MCP). Research caution: verbose
boilerplate context can perform worse than none — context files must be concise
and contain only what the agent can't infer.

## D. Protocol-level delivery & discovery

### MCP Resources
URI-identified data an MCP server exposes as context (application-controlled).
Least-adopted MCP primitive (client UX immature) but docs-as-MCP growing
(GitBook auto-exposes MCP for published docs; llms.txt-fed docs servers).

### Official MCP Registry
Centralized metadata catalog of MCP servers, open API, namespace verification.
Preview since 2025-09-08; ~9,650 servers (2026-05); subregistries build on it.
Nearest thing to a discovery standard for agent-accessible knowledge sources.
https://registry.modelcontextprotocol.io/

### KB description standards (model-card analogs)
**No dedicated, widely adopted "KB card" standard exists as of mid-2026.**
Functional analogs: OKF frontmatter + index.md; SKILL.md metadata; MCP registry
server.json; llms.txt. Model cards (Mitchell et al. 2019) / data cards /
HF YAML card metadata are the mature precedents; EU AI Act codifies card-like
docs. → The kb-card gap is real and is kb-kit's opening.

## E. Context engineering as a discipline

- **Karpathy framing** (June 2025): "the delicate art and science of filling
  the context window with just the right information" — displaced "prompt
  engineering" as the umbrella term.
- **Anthropic, "Effective context engineering for AI agents"** (2025-09-29):
  context as finite resource ("context rot"); compaction, note-taking/memory,
  just-in-time retrieval, sub-agents.
  https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- **LangChain**: "most agent failures are context failures"; the
  write/select/compress/isolate taxonomy (Lance Martin) is standard vocabulary.
  https://blog.langchain.com/the-rise-of-context-engineering/

## F. Memory systems

- **Letta (MemGPT)**: OS-inspired self-editing memory; Feb 2026 rebuild around
  **git-based "context repositories"** — strong signal that agent memory and
  context repos are merging. Letta Code #1 model-agnostic OSS agent on
  Terminal-Bench (2026-06). https://www.letta.com/
- **Mem0 / OpenMemory**: memory-as-a-service API + local-first CLI porting one
  memory across Claude Code/Codex/OpenCode; publishes "State of AI Agent Memory
  2026." https://mem0.ai/
- **ChatGPT memory ("Dreaming V3," 2026-06-04)**: offline consolidation that
  *updates* memories over time; largest deployed memory system; opaque and
  non-portable — the philosophical opposite of markdown context repos.
- **Governance**: AGENTS.md + Skills under Linux Foundation's Agentic AI
  Foundation (Dec 2025); MCP has open governance + July 2026 spec RC. Open
  question: do knowledge-bundle formats (OKF, llms.txt) follow?

## Cross-cutting takeaways

1. **Markdown-files-in-git won** at every layer (instructions, skills, site
   maps, bundles, wikis, even Letta's memory).
2. **Progressive disclosure is the shared mechanism** (skill metadata, OKF
   index.md, CLAUDE.md hierarchy, MCP listings).
3. **Memory and KBs are merging into "context repos."**
4. **The open gap is KB description/discovery** — no adopted "KB card"
   standard; OKF frontmatter is the nearest candidate.
