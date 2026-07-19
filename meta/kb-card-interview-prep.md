# Prep: the kb-card interview (queued)

Maintainer, 2026-07-18: "I think we could better explain the kb-card
concept — that could be an oppty for you to interview me in the future."
Working agreement applies: **one question at a time**, short, phone-friendly.

## Where the concept is explained today (audit)

| Surface | Current treatment | Gap |
| --- | --- | --- |
| [docs/kb-card-spec.md](../docs/kb-card-spec.md) | Full spec: design rules, declared/inferred split, crawler posture, discovery gradient | Solid for implementers; assumes you already believe the premise |
| [kb-card.md](../kb-card.md) body | "This card describes the demo KB…" | Describes itself, not the idea |
| README | One bullet: "a model card for your knowledge base" | The analogy is asserted, never unpacked |
| Marketing page (index.html) | Brief mention among features | No "hundreds of KBs per org" story, no crawler future |
| [taxonomy #9](../docs/taxonomy.md) | Discoverability dimension: "the card IS the KB's interface" | Best line we have; buried |
| [kb-discovery topic](../kb/topics/kb-discovery.md) | The landscape gap kb-card fills | Demo content — gets deleted in forks |

Diagnosis to test in the interview: the *mechanics* are documented, but the
*motivating story* (why a card, why now, what breaks without one, who reads
it) lives only in the maintainer's head and in deletable demo content.

## Proposed questions (ask one at a time; adapt on answers)

1. When you explain kb-card to a colleague in person, what's the sentence or
   analogy you actually use? (Capture their native pitch, not ours.)
2. Who is the card *for*, first: a human deciding whether to trust a KB, an
   agent routing a query, or an org crawler building an index? Rank them.
3. What's the moment a team feels the pain the card solves — what were they
   doing when they wished it existed?
4. The model-card analogy: where does it help, and where does it mislead?
   (Model cards are famously aspirational; our answer is lint-computed
   traits — is that the headline?)
5. Is the card a *proposal to the world* (a standard others should adopt,
   with kb-kit as reference implementation) or *a feature of this kit*? That
   changes where and how loudly we explain it.
6. What should a fork's FIRST kb-card moment feel like during setup — a
   form to fill, or an interview whose output happens to be the card?
7. Where should the canonical explanation live so it survives demo-content
   deletion: the spec doc, the marketing page, a dedicated site view, the
   card body itself?

## Likely follow-on work (don't start before the interview)

- A "why kb-card" section on the marketing page and/or spec intro, in the
  maintainer's own framing.
- Possibly a dedicated site view that renders the card's frontmatter as a
  profile (the "profile for a unit of context" Prukalpa validates).
- README bullet rewritten from the winning analogy.
