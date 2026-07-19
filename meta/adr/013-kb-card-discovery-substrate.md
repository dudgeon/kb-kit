# ADR 013 — kb-card as discovery substrate: hub onboarding, crawlers, external sources

Date: 2026-07-19 · Status: accepted (maintainer vision, interview Q20)

**Context.** Companies will run many KB repos — some woven into a team's
daily routine, others hard to find and understand. The maintainer's
foreseen trajectory: (1) a **context hub** where users manually onboard a
knowledge repo, which then becomes indexed and searchable, and where
linting operations consider the contents of *adjacent* repos; (2) a
**crawler** that fans out across a company's entire GitHub instance and
pulls KBs into the hub *automatically*, identifying them by their kb-card.
The card is what makes both steps practical. Additionally: not all
knowledge lives in GitHub — a KB should point, for its domain, at the
relevant external sources.

**Decision.**

1. **The card is the KB's discovery interface.** Spec and AGENTS.md say so
   explicitly: agents introducing this KB to another system (a hub, a
   crawler, another agent) hand over `kb-card.md` first; AGENTS.md points
   to the card so any agent reading the schema file finds it.
2. **`external_sources` joins the recommended frontmatter**: a list of
   `{name, url, note}` entries for domain-relevant sources that live
   outside the repo (and outside GitHub) — the KB's pointers beyond its own
   bundle. Crawlers/hubs may index these alongside the KB itself.
3. **Design for the hub trajectory.** Card fields stay machine-first
   (frontmatter standalone), the filename stays fixed (`kb-card.md` at
   root, discoverable by code search), and lint keeps the inferred block
   fresh — a hub's ranking signal. Nothing hub-specific is built here; the
   kit just guarantees the card a hub would need.

**Consequences.** Spec gains the field + a "discovery trajectory" section;
the demo card carries example external sources; the queued kb-card
interview narrows (parts of its Q2/Q5 are now answered — the prep doc is
updated). The hub and crawler themselves are future systems outside this
repo.
