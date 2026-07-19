# ADR 005 — kb-card: humans declare, lint infers

Date: 2026-07-18 · Status: accepted (Q5)

kb-card.md has a small mandatory declared core (name, description, scope,
owner + recommended fields) in YAML frontmatter; all measurable traits
(census, freshness, link health, taxonomy grades) are computed by the lint
skill into a fenced block between kb-card:inferred markers. Rationale:
self-graded cards rot into aspiration; computed traits stay honest. Card is
crawlable via GitHub code search `path:kb-card.md`.
