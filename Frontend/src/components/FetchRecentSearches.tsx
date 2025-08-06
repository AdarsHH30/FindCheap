import React from "react";
import { getCSRFToken } from "@/utils/csrf";
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
                <small className="text-gray-500">ID: {search.id}</small>
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
