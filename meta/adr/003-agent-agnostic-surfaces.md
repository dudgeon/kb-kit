# ADR 003 — AGENTS.md canonical; agent-agnostic skills with symlink shims

Date: 2026-07-18 · Status: accepted (Q2)

AGENTS.md is the canonical schema file (Linux Foundation-stewarded standard,
~30 tools); CLAUDE.md is a pointer. Skills live in `skills/<name>/SKILL.md`
(open Agent Skills spec) and are mirrored into `.claude/skills/` via relative
symlinks so Claude Code discovers them. Symlinks are committed to git; on
platforms where symlinks fail (some Windows setups) users can copy instead —
documented trade-off.
