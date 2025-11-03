import { useEffect, useRef } from "react";

export type SiteChunk = {
  site: string;
  results: any[];
  error?: string | null;
};

/**
 * Connects to the SSE stream and invokes callbacks for each per-site result.
 * Only runs in the browser.
 */
export function useScrapeStream(
  query: string | null,
  onChunk: (chunk: SiteChunk) => void,
  onDone?: () => void
) {
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!query || typeof window === "undefined") return;

    const url = `/api/find-products/stream?q=${encodeURIComponent(query)}`;
    const es = new EventSource(url);
    esRef.current = es;

    let siteCount = 0;

    const onStart = (ev: MessageEvent) => {
      try {
        const data = JSON.parse(ev.data);
        if (data.cached !== undefined) {
          console.log(
            `%c🔍 Search: "${query}"`,
            "font-weight: bold; font-size: 14px;"
          );
          if (data.cached) {
            console.log(
              "%c⚡ CACHE HIT - All e-commerce sites loaded instantly from cache!",
              "color: green; font-weight: bold; font-size: 12px;"
            );
          } else {
            console.log(
              "%c🔄 CACHE MISS - Scraping all e-commerce sites (will cache for 10 min)",
              "color: orange; font-weight: bold; font-size: 12px;"
            );
          }
        }
      } catch (e) {
        // ignore
      }
    };

    const onResult = (ev: MessageEvent) => {
      try {
        const data = JSON.parse(ev.data) as SiteChunk | { status?: string };
        if (data && (data as any).site) {
          siteCount++;
          onChunk(data as SiteChunk);
        }
      } catch (e) {
        // ignore malformed payloads
      }
    };

    const onDoneInternal = (ev: MessageEvent) => {
      try {
        const data = JSON.parse(ev.data);
        if (data.cached !== undefined) {
          console.log(
            `%c✓ Received results from ${siteCount} e-commerce site${siteCount !== 1 ? 's' : ''}`,
            "color: blue; font-weight: bold;"
          );
        }
      } catch (e) {
        // ignore
      }
      onDone?.();
      es.close();
    };

    es.addEventListener("start", onStart as EventListener);
    es.addEventListener("result", onResult as EventListener);
    es.addEventListener("done", onDoneInternal as EventListener);

    es.onerror = () => {
      es.close();
    };

    return () => {
      es.close();
    };
  }, [query, onChunk, onDone]);
}
