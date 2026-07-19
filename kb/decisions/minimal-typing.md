---
type: decision
title: "Decision: minimal typing, grown via the loop"
summary: Types start tiny and grow through ingestion and lint; demo-specific types are catalogued so setup can remove them.
source: kb-kit maintainers, 2026-07-18
date: 2026-07-18
owner: kb-kit maintainers
tags: [types, templates, schema]
---

# Decision: minimal typing, grown via the loop

**Decision.** This KB ships the smallest workable type set — `note`, `source`,
`decision`, `topic`, plus two demo types (`standard`, `tool`) — and grows
types only when the ingest/lint loop keeps producing pages that don't fit.
Each type is defined by a prose-plus-minimal-frontmatter template in
`kb/templates/`; adding one means adding a template, logging it, and noting it
in the index. Agents never invent a type mid-task. Demo-specific types are
catalogued in the setup skill so a fresh fork can remove them cleanly with the
demo content.

**Context.** [OKF](../standards/open-knowledge-format.md) deliberately has no
fixed type taxonomy — types are not centrally registered, and consumers must
tolerate unknown ones. Practitioner evidence supports growing rather than
designing: the largest production report on the
[LLM-wiki pattern](../topics/llm-wiki-pattern.md) found the
new-page-vs-edit heuristic works "~90% of the time once the schema enumerates
the page types" — enumerated types earn their keep, speculative ones don't.
The research caution that verbose boilerplate context can perform worse than
none (see [context engineering](../topics/context-engineering.md)) applies to
schemas too: every unused type is index weight an agent must read past.

**What was rejected.** A rich upfront taxonomy ([brainkit](../tools/brainkit.md)
ships person/meeting/task types plus status ladders — right for a personal
second brain, presumptuous for a starter kit); and zero typing (the floor of
`type`/`summary`/`source` is what makes lint and the kb-card census possible;
see [kb-discovery](../topics/kb-discovery.md)).

**Consequences.** Early pages lean on `note`; some will be retyped as the
taxonomy grows — that churn is accepted as cheaper than guessing wrong up
front. `standard` and `tool` exist because *this* demo KB is a landscape
survey; forks that don't need them delete two template files.
