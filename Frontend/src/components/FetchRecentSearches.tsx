import React, { useEffect, useState } from "react";
import { getCSRFToken } from "@/utils/csrf";

interface SearchItem {
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
  console.log("User id is ", user_id);
  useEffect(() => {
    if (!user_id) return;

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
        console.log(response);
        const data = await response.json();

        console.log("Response data:", data);
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

    fetchSearches();
  }, [user_id]);

  if (loading) return <p>Loading recent searches...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Recent Searches</h3>
      <ul className="list-disc ml-5">
        {searches.length === 0 ? (
          <li>No recent searches found.</li>
        ) : (
          searches.map((search, index) => (
            <li key={index}>
              <span className="font-medium">{search.query}</span>{" "}
              <small className="text-gray-500">
                ({new Date(search.searched_at).toLocaleString()})
              </small>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default FetchRecentSearches;
