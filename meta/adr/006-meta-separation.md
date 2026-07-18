# ADR 006 — meta/ holds kit-building files

Date: 2026-07-18 · Status: accepted (Q7, maintainer directive)

Everything outside meta/ must make sense to a fork; everything about building
the kit (plan, research, interview log, ADRs, build-session CLAUDE.md) lives
in meta/. The setup skill offers to delete meta/ in forks; the upstream repo
may keep it as a public build log until release.
