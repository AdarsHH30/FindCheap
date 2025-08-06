import { useState, useEffect } from "react";
import { getCSRFToken } from "@/utils/csrf";

export interface SearchItem {
  id: string;
  query: string;
  searched_at: string;
}

export function useRecentSearches(user_id: string) {
  const [searches, setSearches] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user_id) return;
    fetchSearches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id]);

  const fetchSearches = async () => {
    setLoading(true);
    try {
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_API_URL
          : "http://127.0.0.1:8000";

      const response = await fetch(
        `${baseUrl}/api/search/recent/?user_id=${user_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken() || "",
          },
          credentials: "include",
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch searches");
      }

      setSearches(data.searches);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setSearches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (searchIndex: number) => {
    try {
      const searchToDelete = searches[searchIndex];
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_API_URL
          : "http://127.0.0.1:8000";

      const response = await fetch(`${baseUrl}/api/search/recent/delete/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken() || "",
        },
        credentials: "include",
        body: JSON.stringify({
          user_id,
          search_id: searchToDelete.id || searchToDelete.query,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete search");
      }

      setSearches((prevSearches) =>
        prevSearches.filter((_, i) => i !== searchIndex)
      );
    } catch (err: any) {
      setError(err.message || "Failed to delete search");
    }
  };

  return { searches, loading, error, fetchSearches, handleDelete };
}