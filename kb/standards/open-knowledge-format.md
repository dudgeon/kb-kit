---
type: standard
title: Open Knowledge Format (OKF)
summary: Google's v0.1 draft spec for knowledge bundles — markdown + YAML frontmatter, type as the only required key.
source: https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md
steward: Google (GoogleCloudPlatform/knowledge-catalog, Apache 2.0)
status_note: v0.1 draft, published ~2026-06-12
url: https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md
tags: [okf, format, bundle, frontmatter]
---

# Open Knowledge Format (OKF)

OKF is the format anchor of this kit. It specifies a **knowledge bundle**: a
directory of markdown files with YAML frontmatter, where `type` is the only
required key. "Format, not platform" — no schema registry, no central
authority, no required tooling. A **concept** is one markdown file; its ID is
its path minus `.md`. Two reserved filenames: `index.md` (directory listing,
[progressive disclosure](../topics/progressive-disclosure.md)) and `log.md`
(newest-first change history under `YYYY-MM-DD` headings).

Key design choices: types are not centrally registered (consumers must
tolerate unknown types); unknown frontmatter keys must be preserved; links are
standard markdown only — no wikilinks — with bundle-root-absolute links
"recommended" and relative links also valid; broken links must be tolerated
("it may simply represent not-yet-written knowledge"). The repo ships a
reference enrichment agent (Python, Gemini + BigQuery), an HTML graph
visualizer, and three sample bundles.

The spec explicitly credits and formalizes Karpathy's
[LLM-wiki pattern](../topics/llm-wiki-pattern.md). Its first major external
producer is [OpenWiki](../tools/openwiki.md), which emits OKF bundles in both
its modes (adoption announced 2026-07-16). Duo's vault format independently
uses the same name and carries `okf_version: "0.1"` — see
[duo](../tools/duo.md) and [brainkit](../tools/brainkit.md).

This KB is an OKF bundle with two documented deviations:
[relative links only](../decisions/relative-markdown-links.md) (absolute
bundle paths break GitHub rendering) and
[`_index.md`/`_log.md`](../decisions/underscore-index-files.md) instead of the
reserved names. Full excerpts: [okf-spec source page](../sources/okf-spec.md).
