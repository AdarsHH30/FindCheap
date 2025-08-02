import React, { useEffect, useState } from "react";
import { getCSRFToken } from "@/utils/csrf";

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
  const [searches, setSearches] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user_id) return;
    fetchSearches();
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

      const response = await fetch(`${baseUrl}/api/search/delete/`, {
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

  if (loading)
    return (
      <div className="flex justify-center p-4">
        <div className="animate-pulse">Loading recent searches...</div>
      </div>
    );

  if (error)
    return (
      <div
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <span className="block sm:inline">{error}</span>
      </div>
    );

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
        Recent Searches
      </h3>
      {searches.length === 0 ? (
        <p className="text-gray-500 italic">No recent searches found.</p>
      ) : (
        <ul className="space-y-2">
          {searches.map((search, index) => (
            <li
              key={index}
              className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-md transition-colors"
            >
              <div>
                <span className="font-medium text-indigo-600">
                  {search.query}
                </span>{" "}
                <small className="text-gray-500">
                  {new Date(search.searched_at).toLocaleString()}
                </small>
              </div>
              <button
                onClick={() => handleDelete(index)}
                className="text-red-500 hover:text-red-700 focus:outline-none p-1 rounded-full hover:bg-red-50"
                aria-label="Delete search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FetchRecentSearches;
