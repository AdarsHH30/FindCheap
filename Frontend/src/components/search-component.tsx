"use client";

import React from "react";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import useSendRecentSearch from "@/hooks/useSendRecentSearch";

interface SearchComponentProps {
  redirect?: boolean;
  onSearch?: (query: string) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  redirect = true,
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<string>("");
  const sendRecentSearch = useSendRecentSearch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError("Please enter a search query");
      return;
    }

    setError("");
    console.log("Search query submitted:", searchQuery);
    sendRecentSearch(searchQuery);

    if (redirect) {
      window.location.href = `/find-products?query=${encodeURIComponent(
        searchQuery
      )}`;
    } else if (onSearch) {
      onSearch(searchQuery);
    }
  };
  return (
    <div className="flex flex-col w-full">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="border-1 rounded-lg flex flex-col sm:flex-row justify-between w-full max-w-[600px] mx-auto"
      >
        <div className="p-4 flex gap-2 items-center w-full">
          <Search className="text-primary min-w-5" />
          <input
            type="text"
            placeholder="Search for products..."
            className="border-0 outline-none w-full"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchQuery(e.target.value);
              if (error) setError("");
            }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full sm:w-auto"
        >
          <Button
            size={"lg"}
            className="h-12 text-lg w-full sm:h-full rounded-t-none sm:rounded-t-lg sm:rounded-l-none"
            type="submit"
          >
            Find Best Deals
          </Button>
        </motion.div>
      </motion.form>
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 mt-1 text-sm text-center"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default SearchComponent;
