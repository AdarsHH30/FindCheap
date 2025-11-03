"use client";

import { useState, useCallback } from "react";
import { useScrapeStream, SiteChunk } from "@/hooks/useScrapeStream";

export function LiveScrapeFeed({ query }: { query: string }) {
  const [chunks, setChunks] = useState<SiteChunk[]>([]);
  const onChunk = useCallback((c: SiteChunk) => {
    setChunks((prev) => {
      const i = prev.findIndex((x) => x.site === c.site);
      if (i >= 0) {
        const next = prev.slice();
        next[i] = c;
        return next;
      }
      return [...prev, c];
    });
  }, []);

  useScrapeStream(query, onChunk);

  return (
    <div className="space-y-4">
      {chunks.map((c) => (
        <div key={c.site} className="rounded border p-3">
          <div className="font-medium capitalize">{c.site}</div>
          {c.error ? (
            <div className="text-red-500">Error: {c.error}</div>
          ) : (
            <pre className="text-xs whitespace-pre-wrap break-all">
              {JSON.stringify(c.results, null, 2)}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
}
