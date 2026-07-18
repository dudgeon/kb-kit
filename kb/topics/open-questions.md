---
type: topic
summary: Unsolved questions in the context-repo space worth further exploration — multiplayer governance, ossifying authority, and living with volatile sources.
source: synthesized from linked sources and maintainer questions, 2026-07-18
tags: [governance, volatility, multiplayer, open-questions]
---

# Open questions worth exploring

The [context repo](./context-repo.md) pattern is young; single-player mode is
basically solved and everything past it is frontier. These are the questions
this KB is tracking — each could become its own topic page as answers emerge.

## Multiplayer mode: who lints?

Karpathy's [LLM-wiki pattern](./llm-wiki-pattern.md) assumes one human and
one agent. A team KB needs an answer to *whose job is maintenance*. Emerging
candidates:

- **Scheduled robot + human gate** — [OpenWiki](../tools/openwiki.md) runs
  updates on a daily schedule and opens a PR; maintenance is automatic,
  approval is human. The most credible pattern so far, because it makes lint
  nobody's chore and everybody's review.
- **Owning team as editors** — the [kb-card](./kb-discovery.md) names an
  owner; the owner's on-call rotation could include the KB heartbeat.
- What [Prukalpa's essay](../sources/prukalpa-github-for-context.md) points
  at: every unit of context carrying *owner, approvers, maintainers* — the
  full GitHub-for-code social apparatus (review, CODEOWNERS, blame), reused
  for knowledge.

Unresolved: does agent-written content get lighter or *heavier* review than
human-written? And can two agents lint concurrently without fighting?

## Authority: how do you ossify content, and where does it live?

Not all pages are equal — some knowledge is settled and must win on
contradiction. Prior art: brainkit's `golden/` folder (locked context, loaded
first, wins conflicts, promoted by an explicit human "pin this"), the
verification-status metadata (`unverified → verified`) proposed in the
[gist's](../sources/karpathy-llm-wiki-gist.md) comment threads, and git-level
mechanisms (protected paths, CODEOWNERS).

The open design question: should ossified content live **inside the bundle**
(a `kb/golden/` the agent reads first — portable, but only conventionally
protected) or **at repo root** beside `AGENTS.md` (a constitution above the
KB — structurally distinct, but now knowledge lives in two places, breaking
"the bundle is self-contained")? A middle path: keep it in-bundle but mark it
in frontmatter (`authority: pinned`) so tooling, lint, and the site can
enforce and display it — and the [kb-card](../../kb-card.md) can count it.

## Volatility: version-controlled distillation over living sources

A repo is *semi-volatile* — it changes, but every change is a reviewed diff.
Much of what it describes is *fully volatile*: the Notion roadmap, the Google
Doc PRD, the Slack channel where the decision actually happened. How should
the two layers relate?

- **Pointer, not mirror**: OKF's `resource:` frontmatter field exists for
  exactly this — a page carries the canonical URI of the living asset and
  distills what's stable about it; the volatile detail stays upstream.
- **Scheduled pull-and-distill**: OpenWiki Brains'
  ["proactive memory"](../tools/openwiki.md) — agents fetch from connectors
  (Slack, Gmail, Notion) on a schedule and write distillations, rather than
  waiting to be handed content.
- **Honest staleness**: stamp the page with when the source was last
  consulted (`date` on [sources](../templates/source.md)); lint flags pages
  whose living source has outlived its last distillation. "Trust the dates,
  not the tense."

Unresolved: Slack is the hard case — no stable URI worth pointing at, and
the knowledge is in the *aggregate*, not any message. Distill-on-decision
("when a thread concludes, someone says *ingest this*") may beat any crawler.
One production answer now exists: [Cerebras](../sources/cerebras-kb-blog.md)
continuously upserts whole threads and has an LLM distill each into a
structured question/summary/resolution artifact — the artifact is embedded,
not the transcript, and "accuracy increased significantly."

## Also on the watchlist

- **Scale**: the flat `_index.md` works to ~hundreds of pages; past that,
  practitioners report hybrid search (SQLite FTS5 + embeddings). When should
  a kit graduate, and to what — without breaking the no-server rule?
- **Federation**: hundreds of KBs per org — cross-KB links, scope
  negotiation between neighboring KBs, and a crawler over
  [kb-cards](./kb-discovery.md) as the org-wide index.
- **Trust loops**: preventing circular evidence (KB pages citing KB pages);
  provenance floors for agent-inferred claims.
