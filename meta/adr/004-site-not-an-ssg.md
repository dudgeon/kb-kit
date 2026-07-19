# ADR 004 — Client-rendered site; explicitly not an SSG

Date: 2026-07-18 · Status: accepted (Q6, maintainer directive)

No per-markdown HTML twins. One app shell (knowledge-base.html) with hash
routes (search home, search results, type overview, page view) fetches raw md
and renders client-side; a GitHub Action only builds JSON (manifest + search
index) and deploys the Pages artifact. Page views carry affordances to the
canonical md on GitHub (view/edit/issue/history). All front-end files must be
heavily commented and agent-friendly — forks customize them with agents. No
external CDNs; vanilla ES modules; hand-written markdown renderer (escapes
raw HTML by default).
