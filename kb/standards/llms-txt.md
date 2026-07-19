---
type: standard
title: llms.txt
summary: Root markdown index curating a website's content for LLM consumption — growing fast, but major crawlers still ignore it.
source: https://llmstxt.org/
steward: Jeremy Howard / Answer.AI (proposed Sept 2024)
status_note: growing adoption, no formal governance body
url: https://llmstxt.org/
tags: [llms-txt, websites, indexes]
---

# llms.txt

llms.txt is a markdown file at a website's root that curates the site's
content for LLMs — an index of what matters, in a form a model can consume
without scraping the whole site. Proposed by Jeremy Howard (Answer.AI) in
September 2024.

**Adoption reality — the honest version:** ~8.7% of top-1000 sites carry one
as of 2026-06, roughly 5.6x growth in twelve months, and Shopify deployed it
platform-wide. But **major LLM crawlers still don't reliably fetch it**. The
real consumers today are IDE agents and docs-MCP servers (docs servers fed by
llms.txt, and services like GitBook that auto-expose published docs over
[MCP](./mcp.md)). It is a supply-side standard whose demand side hasn't fully
arrived.

**Where it fits in this survey:** llms.txt is
[progressive disclosure](../topics/progressive-disclosure.md) applied to a
website — the same job [OKF](./open-knowledge-format.md)'s `index.md` does for
a knowledge bundle, and kb-card proposes for whole KBs (see
[KB discovery](../topics/kb-discovery.md)). It also shares the open governance
question flagged in the research: AGENTS.md and Skills found a neutral home in
the Linux Foundation; llms.txt and OKF have not, yet.

For a KB published as a website (as kb-kit bundles are, via the static site),
an llms.txt is a plausible complement to the root `_index.md` — same content,
different discovery surface.
