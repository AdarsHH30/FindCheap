import React, { useState } from "react";
import axios from "axios";

function Search() {
  const [query, setQuery] = useState("");

  const sendSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await axios.get(
        `http://localhost:8000/search?query=${query}`
      );
      console.log("Search sent:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="search">
      <input
        type="text"
        placeholder="Enter the product to search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={sendSearch}>Search</button>
    </div>
  );
}

export default Search;
