import React, { useState } from "react";
import { useRecentSearches } from "@/hooks/useRecentSearches";

interface SearchItem {
  id: string;
  query: string;
  searched_at: string;
}

interface FetchRecentSearchesProps {
  user_id: string;
}

const FetchRecentSearches: React.FC<FetchRecentSearchesProps> = ({
  user_id,
}) => {
  const { searches, loading, error, handleDelete } = useRecentSearches(user_id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  if (loading)
    return (
      <div className="flex justify-center p-4">
        <div className="animate-pulse text-muted-foreground">
          Loading recent searches...
        </div>
      </div>
    );

  if (error)
    return (
      <div
        className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded relative"
        role="alert"
        aria-live="polite"
      >
        <span className="block sm:inline">{error}</span>
      </div>
    );

  const timeAgo = (iso: string) => {
    try {
      const then = new Date(iso);
      const now = new Date();
      const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
      if (diff < 60) return `${diff}s ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
      return then.toLocaleDateString();
    } catch (e) {
      return iso;
    }
  };

  const notify = (msg: string) => {
    setActionMessage(msg);
    window.setTimeout(() => setActionMessage(null), 1800);
  };

  const onDelete = (index: number, query: string) => {
    const confirmed = window.confirm(`Delete recent search "${query}"?`);
    if (!confirmed) return;
    handleDelete(index);
    notify("Deleted");
  };

  const onCopy = async (query: string, id: string) => {
    try {
      await navigator.clipboard.writeText(query);
      setCopiedId(id);
      notify("Copied to clipboard");
      window.setTimeout(() => setCopiedId(null), 1400);
    } catch (e) {
      notify("Copy failed");
    }
  };

  const clearAll = () => {
    if (searches.length === 0) return;
    const confirmed = window.confirm("Clear all recent searches?");
    if (!confirmed) return;
    for (let i = searches.length - 1; i >= 0; i--) {
      handleDelete(i);
    }
    notify("Cleared all");
  };

  return (
    <div className="bg-card rounded-lg shadow-md p-4 border">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-card-foreground">Recent Searches</h3>
        <div className="flex items-center gap-2">
          {actionMessage && (
            <div className="text-sm text-muted-foreground mr-2" aria-live="polite">
              {actionMessage}
            </div>
          )}
          <button
            onClick={clearAll}
            disabled={searches.length === 0}
            className="text-sm text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed bg-muted hover:bg-muted/80 px-2 py-1 rounded-md"
            aria-label="Clear all recent searches"
            title="Clear all"
          >
            Clear all
          </button>
        </div>
      </div>

      {searches.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-2">No recent searches yet</div>
          <div className="text-sm text-muted-foreground/70">
            Try searching for a product to see it here.
          </div>
        </div>
      ) : (
        <ul className="space-y-2">
          {searches.map((search, index) => (
            <li
              key={search.id}
              className="flex items-center justify-between py-2 px-3 hover:bg-muted/50 rounded-md transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center bg-primary/10 text-primary rounded-full w-8 h-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387-1.414 1.414-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <div>
                  <button
                    onClick={() => onCopy(search.query, search.id)}
                    title="Copy query"
                    className="text-left"
                  >
                    <div className="font-medium text-primary truncate max-w-[40ch]">
                      {search.query}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      <span
                        title={new Date(search.searched_at).toLocaleString()}
                      >
                        {timeAgo(search.searched_at)}
                      </span>
                      <span className="ml-2 text-muted-foreground/70">•</span>
                      <span className="ml-2 text-muted-foreground/70">
                        ID: {search.id}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {copiedId === search.id && (
                  <span className="text-sm text-primary">Copied</span>
                )}
                <button
                  onClick={() => onDelete(index, search.query)}
                  className="text-destructive hover:text-destructive/80 focus:outline-none p-1 rounded-full hover:bg-destructive/10"
                  aria-label={`Delete search ${search.query}`}
                  title="Delete"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FetchRecentSearches;
