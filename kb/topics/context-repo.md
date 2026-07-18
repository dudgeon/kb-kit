---
type: topic
title: The context repo
summary: A durable, versioned knowledge substrate shared by humans and agents — the idea this KB surveys.
source: synthesized from linked sources, 2026-07-18
tags: [context-repo, decoupling, markdown, git]
---

# The context repo

A context repo is a version-controlled collection of markdown files that serves
as the durable knowledge substrate for both humans and agents: readable without
tooling, parseable without SDKs, diffable in git, portable across agent stacks.
This repo's own `kb/` bundle is one.

The strongest argument for standalone context repos is the **decoupling
thesis**, put sharpest by Prukalpa Sankar (2026-07-16): "The agent layer is
becoming disposable, but a company's context is not — yet most tools still bind
the two together." Her essay recounts a company that burned through five agent
stacks in twelve months, each migration stranding the context that made the
agents useful ([source](../sources/prukalpa-github-for-context.md)).

The pattern converged from several directions in 2025–2026:

- Karpathy's [LLM-wiki pattern](./llm-wiki-pattern.md) showed an agent can
  maintain a compounding markdown wiki instead of per-query RAG
  ([gist](../sources/karpathy-llm-wiki-gist.md)).
- Google's [Open Knowledge Format](../standards/open-knowledge-format.md)
  specified it: "if you can `cat` a file, you can read OKF; if you can
  `git clone` a repo, you can ship it" ([spec](../sources/okf-spec.md)).
- Memory systems moved toward it — [Letta](../tools/letta.md) rebuilt around
  git-based "context repositories" in Feb 2026 (see
  [agent memory](./agent-memory.md)).
- [OpenWiki](../tools/openwiki.md) shipped a reference implementation emitting
  OKF bundles; [Cerebras](../sources/cerebras-kb-blog.md) published a
  first-party account of an internal agent-queried company KB.

The mid-2026 takeaway across the survey: markdown-files-in-git won at every
layer — instructions, skills, site maps, bundles, wikis, even memory. What is
still missing is the operating layer around the files: discovery, ownership,
review — see [KB discovery](./kb-discovery.md).
