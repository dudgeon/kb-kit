# ADR 012 — Three intake channels, one ingest loop

Date: 2026-07-19 · Status: accepted (maintainer feedback, interview Q19)

**Context.** ADR 009 established inbox → ingest → raw archive. The
maintainer generalized intake: casual contributors won't clone a repo to
drop a file, and the most common real usage is conversational — a user
teaches their agent something in a session and says "ingest this."

**Decision.** Knowledge enters through three channels, all served by the
same ingest skill:

1. **The current session** — the primary path. Material shared or developed
   in conversation; the user says "/ingest this" (or the agent offers).
2. **`kb/inbox/`** — the drop folder, for files (ADR 009 mechanics
   unchanged: capture → distill → propagate → move original to
   `kb/sources/raw/`).
3. **GitHub issues** — the no-clone path. Anyone can open an issue
   containing or pointing at knowledge; an inbox sweep ("process the
   inbox") scans **open issues alongside the inbox folder**. After
   ingesting from an issue, the agent comments with what landed where and
   proposes closing it.

The KB home teaches all three concretely (educational links: create a file
in the inbox via the GitHub UI, open an issue, or run ingest in a session)
and sets the expectation that un-swept items wait for the next maintainer
pass.

**Consequences.** The ingest skill documents the issue-scan; issues become
a lightweight queue visible to lint ("issues waiting" alongside "inbox
items waiting" in spirit — lint proposes a sweep when either lingers).
No server-side automation is involved (ADR/Q15): sweeps run in the
maintainer's own agent session.
