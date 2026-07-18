# Interview Log (temporary — delete before release)

Running log of questions asked of the maintainer and their answers, kept so the
parallel agent working on `main` can compare notes.

Agent: session working on branch `claude/kb-starter-kit-2wh4pk`
Started: 2026-07-18

---

## Q&A

### Q1 — How deep should the KB structure go? (2026-07-18)

Options offered: (a) middle path — OKF floor + starter type templates;
(b) full brainkit-style graph; (c) OKF minimal.

**A:** Start minimal and only build up as needed — KBs should "grow" their
typing and opinionation via ingestion and linting. But the reference kit must
ship a **setup/onboarding skill** that: deletes the reference KB content,
interviews the new KB owner about their needs (the repo is designed to be
forked), and adds types as needed. The infrastructure for typing should exist,
but typing itself stays minimal; any typing added for illustrative purposes
must be catalogued and removable via the setup skill.

## Research notes / decisions pending interview

- Repo was near-empty at session start (README only); `main` and
  `claude-initial-research` identical to this branch's base. No other-agent
  activity observed yet.
- Research complete → see `research/` (OKF spec, Karpathy gist, brainkit/duo,
  landscape survey) and `PLAN.md` for defaults + open questions.
- Key research findings shaping questions:
  - Google OKF v0.1: `type` is the only required frontmatter field; reserves
    `index.md`/`log.md`; md links only (absolute-from-bundle-root "recommended"
    but breaks GitHub rendering; relative is valid → we choose relative).
  - duo's OKF flavor now defaults `_index.md`/`_log.md` (Google reserves the
    non-underscore names) — candidate compat PR back to duo.
  - No adopted "KB card" standard exists (mid-2026) — kb-card is a real gap;
    nearest analogs: OKF frontmatter, SKILL.md metadata, MCP registry
    server.json, model/data cards.
