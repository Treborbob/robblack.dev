/**
 * Public repository facts from the GitHub API, fetched once at build time and
 * baked into the static page. Best effort: any failure returns null and the
 * build renders without them. An optional GITHUB_TOKEN raises the rate limit.
 */

export interface RepoLanguage {
  name: string;
  /** Whole-number percentage of bytes. */
  share: number;
  colour: string;
}

export interface RepoFacts {
  commits: number | null;
  latest: { sha: string; message: string; date: string; url: string } | null;
  ci: "passing" | "failing" | null;
  licence: string | null;
  languages: RepoLanguage[];
}

const API = "https://api.github.com";

/** GitHub's own linguist colours for the languages that appear here. */
const languageColours: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  CSS: "#663399",
  HTML: "#e34c26",
  Swift: "#f05138",
  Shell: "#89e051",
  Makefile: "#427819",
};

interface RepoMeta {
  html_url: string;
  license: { spdx_id: string } | null;
}
interface Commit {
  sha: string;
  html_url: string;
  commit: { message: string; author: { date: string } };
}
interface WorkflowRuns {
  workflow_runs: { conclusion: string | null }[];
}

/** "https://github.com/owner/name" -> "owner/name" */
function slug(repo: string): string {
  return new URL(repo).pathname.replace(/^\/|\/$/g, "");
}

async function get<T>(
  path: string,
): Promise<{ body: T; headers: Headers } | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "robblack.dev",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const res = await fetch(`${API}${path}`, { headers, cache: "force-cache" });
    if (!res.ok) return null;
    return { body: (await res.json()) as T, headers: res.headers };
  } catch {
    return null;
  }
}

/** Total pages from a Link header when paging one item at a time. */
function lastPage(link: string | null): number | null {
  const match = link?.match(/[?&]page=(\d+)>;\s*rel="last"/);
  return match ? Number(match[1]) : null;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export async function repoFacts(repo: string): Promise<RepoFacts | null> {
  const name = slug(repo);
  const [meta, commits, languages, runs] = await Promise.all([
    get<RepoMeta>(`/repos/${name}`),
    get<Commit[]>(`/repos/${name}/commits?per_page=1`),
    get<Record<string, number>>(`/repos/${name}/languages`),
    get<WorkflowRuns>(
      `/repos/${name}/actions/workflows/ci.yml/runs?per_page=1&branch=main`,
    ),
  ]);
  if (!meta && !commits) return null;

  const head = commits?.body[0];
  const latest = head
    ? {
        sha: head.sha.slice(0, 7),
        message: head.commit.message.split("\n")[0],
        date: head.commit.author.date,
        url: head.html_url,
      }
    : null;

  const conclusion = runs?.body.workflow_runs[0]?.conclusion;
  const ci =
    conclusion === "success"
      ? "passing"
      : conclusion === "failure"
        ? "failing"
        : null;

  const bytes = Object.entries(languages?.body ?? {});
  const total = bytes.reduce((sum, [, n]) => sum + n, 0);
  const shares = bytes
    .map(([lang, n]) => ({
      name: lang,
      share: Math.round((n / total) * 100),
      colour: languageColours[lang] ?? "var(--color-line-strong)",
    }))
    .filter((l) => l.share > 0)
    .sort((a, b) => b.share - a.share);

  return {
    commits: commits
      ? (lastPage(commits.headers.get("link")) ?? commits.body.length)
      : null,
    latest,
    ci,
    licence: meta?.body.license?.spdx_id ?? null,
    languages: shares,
  };
}
