/**
 * config.js — site configuration and GitHub repo detection
 * ========================================================
 *
 * WHAT THIS IS
 *   The one place the KB app learns which GitHub repo it belongs to, so it
 *   can build "View on GitHub" / "Edit" / "Open an issue" / "History" links.
 *
 * HOW DETECTION WORKS
 *   On GitHub Pages the URL is https://<owner>.github.io/<repo>/... — so we
 *   read the owner from the hostname and the repo from the first path
 *   segment. On a custom domain, localhost, or a user/org root site
 *   (owner.github.io with no repo path) that inference fails, and the
 *   CONFIG fallback below is used instead.
 *
 * SAFE TO CUSTOMIZE (forks: this is the FIRST file to edit)
 *   - CONFIG.owner / CONFIG.repo — set to your fork, e.g. "acme" / "kb".
 *   - CONFIG.branch — if your default branch isn't "main".
 *   - CONFIG.siteTitle — shown in the app header and document titles.
 *
 * WILL BREAK THINGS
 *   - Removing the repoInfo() export (views.js imports it).
 */

/**
 * Fallback configuration — used whenever the repo can't be derived from the
 * page URL. Forks should set owner/repo here so GitHub links work in local
 * preview (python3 -m http.server) and on custom domains too.
 */
export const CONFIG = {
  owner: "dudgeon",        // ← your GitHub username or org
  repo: "kb-kit",          // ← this repository's name
  branch: "main",          // default branch used for edit/history links
  siteTitle: "kb-kit — knowledge base",
};

/**
 * Return { owner, repo, branch } for the current deployment.
 * Priority: URL inference (owner.github.io/<repo>/) → CONFIG fallback.
 */
export function repoInfo() {
  const host = window.location.hostname;
  const m = host.match(/^([^.]+)\.github\.io$/i);
  if (m) {
    // First path segment is the repo for project pages. For a user/org root
    // site ("<owner>.github.io" repo) there is no segment — use CONFIG.repo.
    const seg = window.location.pathname.split("/").filter(Boolean)[0];
    return {
      owner: m[1],
      repo: seg || CONFIG.repo,
      branch: CONFIG.branch,
    };
  }
  return { owner: CONFIG.owner, repo: CONFIG.repo, branch: CONFIG.branch };
}

/** Base URL of the repo on github.com, e.g. "https://github.com/acme/kb". */
export function repoUrl() {
  const { owner, repo } = repoInfo();
  return `https://github.com/${owner}/${repo}`;
}
