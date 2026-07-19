/**
 * search.js — client-side keyword search over search-index.json
 * =============================================================
 *
 * WHAT THIS IS
 *   A deliberately simple scorer: substring matching, multi-term AND,
 *   field-weighted. No stemming, no fuzzy matching, no web workers — the
 *   whole index for a few hundred pages is tens of KB, and simple scoring
 *   is easy for a fork's agent to reason about and tune.
 *
 * HOW SCORING WORKS
 *   The query is lowercased and split on whitespace into terms. A page
 *   matches only if EVERY term appears somewhere in it (title, tags, type,
 *   summary, or body blob). Each term contributes points by where it hits:
 *
 *       title    → WEIGHTS.title    (best signal)
 *       tag/type → WEIGHTS.tag
 *       summary  → WEIGHTS.summary
 *       body     → WEIGHTS.body     (weakest signal)
 *
 *   A whole-query phrase hit in the title adds WEIGHTS.phraseBonus.
 *   Results are sorted by score, ties broken alphabetically by title.
 *
 * SAFE TO CUSTOMIZE
 *   - WEIGHTS — retune relevance without touching the algorithm.
 *   - Switch AND → OR: change `every` to `some` in the match check
 *     (documented inline below).
 *
 * WILL BREAK THINGS
 *   - Assuming fields exist: entries come from build-index.mjs; if you
 *     change its output shape, update the field reads here.
 */

/** Relative field weights. Bigger = counts more. Tune freely. */
export const WEIGHTS = {
  title: 10,
  tag: 5,
  summary: 3,
  body: 1,
  phraseBonus: 8, // full query appears verbatim in the title
};

/**
 * Search the index.
 * @param {string} query       raw user input
 * @param {Array}  entries     search-index.json `entries`
 * @param {Map}    summaryByPath  path → summary string (from the manifest),
 *                                so summaries can be weighted separately
 *                                from the body blob. Optional.
 * @returns {Array<{entry, score}>} sorted best-first; empty for blank query
 */
export function search(query, entries, summaryByPath = new Map()) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  const results = [];
  for (const entry of entries) {
    const title = (entry.title || "").toLowerCase();
    const tags = (entry.tags || []).join(" ").toLowerCase() + " " + (entry.type || "");
    const summary = (summaryByPath.get(entry.path) || "").toLowerCase();
    const body = entry.blob || "";

    let score = 0;
    let allMatch = true;
    for (const term of terms) {
      let termScore = 0;
      if (title.includes(term)) termScore += WEIGHTS.title;
      if (tags.includes(term)) termScore += WEIGHTS.tag;
      if (summary.includes(term)) termScore += WEIGHTS.summary;
      if (body.includes(term)) termScore += WEIGHTS.body;
      if (termScore === 0) { allMatch = false; break; } // AND semantics —
      // for OR search: delete the line above and let non-matching terms
      // simply contribute zero.
      score += termScore;
    }
    if (!allMatch) continue;

    if (terms.length > 1 && title.includes(q)) score += WEIGHTS.phraseBonus;
    results.push({ entry, score });
  }

  results.sort(
    (a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title)
  );
  return results;
}
