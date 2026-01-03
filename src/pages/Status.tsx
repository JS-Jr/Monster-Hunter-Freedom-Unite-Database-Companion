import { useEffect, useState } from "react";

const COMMITS_URL =
  "https://api.github.com/repos/JS-Jr/Monster-Hunter-Freedom-Unite-Database-Companion/commits";

const CACHE_KEY = "status_commits";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export function Status() {
  const [commits, setCommits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);

    if (cached) {
      const { data, timestamp } = JSON.parse(cached);

      if (Date.now() - timestamp < CACHE_TTL) {
        setCommits(data);
        setLoading(false);
        return;
      }
    }

    fetch(COMMITS_URL, {
      headers: { "User-Agent": "status-page" },
    })
      .then((res) => res.json())
      .then((data) => {
        const sliced = data.slice(0, 10);

        setCommits(sliced);
        setLoading(false);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: sliced,
            timestamp: Date.now(),
          })
        );
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading status…</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Project Status</h1>
      <a
        href="https://github.com/JS-Jr/Monster-Hunter-Freedom-Unite-Database-Companion"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mb-6 text-sm font-medium text-[#5A3F28] hover:underline"
      >
        View on GitHub
      </a>

      <ul className="space-y-3">
        {commits.map((c) => (
          <li key={c.sha} className="border rounded p-3">
            <p className="font-semibold">{c.commit.message}</p>
            <p className="text-sm opacity-60">
              {new Date(c.commit.author.date).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
