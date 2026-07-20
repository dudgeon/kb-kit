# ADR 015 — Visual system: "field manual" (paper/ink/mono, monochrome type glyphs)

Date: 2026-07-19 · Status: accepted (maintainer selected via claude.ai/design
review, project "Design review request: KB-Kit", direction 1a + 2a
structure + 3b copy voice)

**Context.** The original site.css shipped a generic blue-accent,
rounded-corner, per-type-tinted-pill look with no stated design rationale.
The maintainer explored three directions in a claude.ai/design project
(1a "field manual", 1b "card catalog", 1c "broadsheet") plus voice-shifted
refinements, and selected 1a's system, structured per 2a (card-as-hero
artifact, file tree below), with 3b's plainer copy pass (no imperative
CTAs, lineage framed as pattern-membership, fork framed as ownership —
folds into ADR 011's voice rule).

**Decision.**

1. **Token system**: paper background `#fafaf7` / near-black ink `#16181d`
   / one drafting-green accent `oklch(0.48 0.10 155)`. Square corners
   (`--radius: 0`) and hard-offset shadows (`3px 3px 0 rgba(...)`, no
   blur) throughout — corners and shadows are part of the system, not
   incidental styling.
2. **Monospace does structural work**: section labels, frontmatter keys,
   metadata, and the site header nav are all `--font-mono` small caps over
   a 1px ink rule (`.rule-label` / `.kb-section-label`). Prose stays
   system-sans.
3. **Type pills go monochrome with a glyph per type**, replacing the old
   per-type color tints (`--type-note` etc. token pairs and their
   `.pill-type-*` background/color rules): `◦ note · ● topic · → source ·
   ◆ decision · § standard · ▲ tool`, all rendered via
   `.pill-type-<type>::before { content: "…" }`. A fork adding a custom
   type gets a plain monochrome pill for free and can add a glyph rule
   optionally (was: had to add a `--type-<name>` token pair to keep pills
   from falling back to a generic tint).
4. **index.html rewritten** around ADR 011's voice: hero shows a real KB
   page as a rotated frontmatter-card artifact instead of prose claims;
   numbered "How it works" rows; an annotated file tree; a terminal block
   for the fork steps; the taxonomy list. The former "Why now" pull-quote
   section, feature-card grids, and multi-CTA final section are gone —
   ADR 011 already ruled out adjective-driven marketing copy, and 3b's
   pass additionally dropped imperative CTA phrasing.

**Consequences.** `docs/site-guide.md`'s customization section describes
the glyph mechanism, not token pairs, to add a type's visual identity. The
`--type-*` CSS custom properties are gone; a fork restoring per-type tints
adds `--type-<name>` tokens and a `.pill-type-<name>` rule itself (site.css
section 1's comment says so). No JS changed — `assets/js/views.js` already
emitted `class="pill pill-type-<type>"`; only the CSS rule for that class
changed shape. Dark-mode token block re-derived for the new palette
(paper→charcoal `#14161a`, ink→off-white `#e7e6df`, accent lightened for
contrast) so both themes stay coherent from the same token names.
