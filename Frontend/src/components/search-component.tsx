import React from "react";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

const SearchComponent = ({
  handleSearch,
}: {
  handleSearch: (query: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <motion.form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch(searchQuery);
      }}
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="border-1 h-16 w-[600px] rounded-lg flex justify-between 4"
    >
      <div className="p-4 flex gap-2  items-center w-full">
        <Search className="text-primary" />
        <input
          type="text"
          placeholder="Search for products..."
          className="border-0 outline-none w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button size={"lg"} className="h-full text-lg" type="submit">
          Find Best Deals
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default SearchComponent;
