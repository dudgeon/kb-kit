# ADR 008 — Pages deploys from a branch, never from Actions

Date: 2026-07-18 · Status: accepted (maintainer directive, interview Q10 —
"a firm requirement")

**Context.** The kit's target users work in environments (e.g. GitHub
Enterprise Cloud with strict Pages policies) where GitHub Pages may ONLY be
deployed from a branch — the "GitHub Actions" Pages source is unavailable.
Actions are permitted for CI, but not as the Pages publisher. Because the kit
is meant to be cloned into exactly those environments, the upstream repo must
use the same mechanism it asks forks to use.

**Decision.**

1. Pages source is **Deploy from a branch**: `main`, `/ (root)`. The site is
   already static-at-rest — HTML/JS/CSS plus committed markdown — so the repo
   root IS the artifact.
2. A root **`.nojekyll`** file is mandatory. Without it, Jekyll processing
   silently excludes underscore-prefixed paths — which would drop every
   `_index.md`/`_log.md` in the KB — and can fail outright on strict GHEC
   configs.
3. `assets/data/{manifest,search-index}.json` are **committed artifacts**,
   the canonical ones (no longer "for local preview only"). Whoever edits
   `kb/` runs `node scripts/build-index.mjs` and commits the result.
4. The old deploy workflow is replaced by a **CI backstop**
   (`.github/workflows/build-index.yml`): on push to main it rebuilds the
   JSON and commits it back only if drifted. If Actions are disabled
   entirely, nothing breaks — the site just serves whatever JSON was last
   committed.

**Consequences.** Enabling the site on a fork is a one-time Settings → Pages
→ Deploy from a branch selection with no workflow dependency. The repo's
whole contents (including `meta/` until it is deleted pre-release, ADR 006)
are published — acceptable, the repo is public. Docs, README, and the setup
skill now instruct branch deployment.
