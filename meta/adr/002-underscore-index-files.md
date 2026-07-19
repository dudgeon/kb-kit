# ADR 002 — _index.md and _log.md

Date: 2026-07-18 · Status: accepted (maintainer directive, Q7)

Maintainer intentionally prefers `_index.md` so the index sorts first in file
navigators; matches duo's ENH-245 default; `_log.md` pairs (never mixed),
confirmed Q8. Trade-off: diverges from OKF's reserved names; we keep the
reserved files' *structure* so a rename restores strict conformance.
