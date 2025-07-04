"use client";

import SearchComponent from "@/components/search-component";
import React from "react";
import Image from "next/image";
import { dummy_data } from "./dummy-data";
import { motion } from "framer-motion";

const SearchPage = () => {
  return (
    <div className="flex flex-col items-center p-10 h-[calc(100vh-var(--navbar-height,57px))]">
      <SearchComponent />

      <div className="w-full flex justify-between items-center mt-8 ">
        <h1 className="text-2xl font-bold">Search Results</h1>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Sort by:</span>
          {/* TODO: Replace with shadcn select component */}
          <select className="border rounded p-1">
            <option value="relevance">Relevance</option>
            <option value="price-low-to-high">Price: Low to High</option>
            <option value="price-high-to-low">Price: High to Low</option>
          </select>
        </div>
      </div>
      <div
        className="mt-4 overflow-scroll w-full"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Map through search results and display them */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {dummy_data.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4 mb-4 p-4 border rounded-lg"
              whileTap={{ scale: 0.95 }}
            >
              <Image
                height={64}
                width={64}
                src={item.imageUrl}
                alt={item.productName}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h2 className="text-lg font-semibold">{item.productName}</h2>
                <p className="text-foreground/50">{item.price}</p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  View Product
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SearchPage;
