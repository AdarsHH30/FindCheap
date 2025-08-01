import React, { useState, useEffect } from "react";

interface SearchItem {
  query: string;
  searched_at: string;
}

interface FetchRecentSearchesProps {
  limit?: number;
  onSearchesLoaded?: (searches: SearchItem[]) => void;
}

const FetchRecentSearches: React.FC<FetchRecentSearchesProps> = ({
  limit = 10,
  onSearchesLoaded,
}) => {
  const [searches, setSearches] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentSearches = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/searches/recent`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.searches && Array.isArray(data.searches)) {
          const limitedSearches = data.searches.slice(0, limit);
          setSearches(limitedSearches);
          if (onSearchesLoaded) {
            onSearchesLoaded(limitedSearches);
          }
        } else {
          setError("Invalid response format");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch recent searches"
        );
        console.error("Error fetching recent searches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentSearches();
  }, [limit, onSearchesLoaded]);

  if (loading) {
    return <div className="loading">Loading recent searches...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (searches.length === 0) {
    return <div className="no-searches">No recent searches found</div>;
  }

  return (
    <div className="recent-searches">
      <h2>Recent Searches</h2>
      <ul className="searches-list">
        {searches.map((search, index) => (
          <li key={index} className="search-item">
            <span className="search-query">{search.query}</span>
            <span className="search-timestamp">
              {new Date(search.searched_at).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FetchRecentSearches;
