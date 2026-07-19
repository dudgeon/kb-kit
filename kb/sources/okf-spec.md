---
type: source
title: Google Open Knowledge Format — SPEC.md v0.1
summary: The v0.1 draft spec for knowledge bundles — markdown concepts, YAML frontmatter, type required, reserved index.md/log.md.
source: https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md
url: https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md
date: 2026-06-12
status: processed
tags: [okf, spec, google]
---

# Google Open Knowledge Format — SPEC.md v0.1

v0.1 Draft, published ~2026-06-12, Apache 2.0, in the
`GoogleCloudPlatform/knowledge-catalog` repo (with a Google Cloud blog
announcement). Defines the knowledge bundle / concept model, the
frontmatter contract (`type` required, unknown keys preserved), markdown-only
linking, and the reserved `index.md`/`log.md` roles. Ships a reference
enrichment agent (Python, Gemini + BigQuery), a Cytoscape.js HTML graph
visualizer, and three sample bundles (GA4 e-commerce, Stack Overflow,
Bitcoin). §10 positions OKF as the Karpathy
[LLM-wiki pattern](../topics/llm-wiki-pattern.md) "specified."

Propagated to: [open-knowledge-format](../standards/open-knowledge-format.md),
[context-repo](../topics/context-repo.md), and the decisions
[relative-markdown-links](../decisions/relative-markdown-links.md) and
[underscore-index-files](../decisions/underscore-index-files.md).

## Key excerpts

- "The format is intentionally minimal: a directory of markdown files with
  YAML frontmatter. There is no schema registry, no central authority, and no
  required tooling. If you can `cat` a file, you can read OKF; if you can
  `git clone` a repo, you can ship it."
- Types: "Producers SHOULD pick values that are descriptive and
  self-explanatory; consumers MUST tolerate unknown types gracefully."
- Keys: "Producers MAY include any additional keys. Consumers SHOULD preserve
  unknown keys when round-tripping and SHOULD NOT reject documents with
  unrecognized fields."
- Links: "Consumers MUST tolerate broken links — ... it may simply represent
  not-yet-written knowledge."
- Conformance (§9): every non-reserved `.md` file has parseable YAML
  frontmatter with a non-empty `type`; reserved filenames follow the spec'd
  structure when present.
- kb-kit note preserved from research: bundle-root-absolute links (the spec's
  "recommended" form) do NOT render correctly in the GitHub web UI or on
  GitHub Pages; relative links are spec-valid and render everywhere.
