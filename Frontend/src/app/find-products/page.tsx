"use client";

import SearchComponent from "@/components/search-component";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

// TODO: Move interfaces to a separate file
interface Product {
  title: string;
  price: string;
  link: string;
  rating?: string;
  reviews?: string;
  image: string;
  similarity_score: number;
}

interface SearchResults {
  [platform: string]: Product[];
}

const FindProductsPage = () => {
  const [data, setData] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);

  // TODO: Send search query to backend and fetch results
  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/find-products");
      const data = await res.json();
      setData(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 h-[calc(100vh-var(--navbar-height,57px))]">
      <SearchComponent onClick={handleSearch} />

      <div className="w-full flex justify-between items-center">
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
        {/* Show loading state */}
        {/* TODO: Make a separate loading component */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <span className="text-gray-500">Loading products...</span>
          </div>
        )}

        {/* Map through search results by platform and display them */}
        {data &&
          Object.entries(data).map(
            ([platform, products]: [string, Product[]]) => (
              <div key={platform} className="mb-8">
                <h2 className="text-xl font-bold mb-4 capitalize flex items-center gap-2">
                  <Image
                    src={`/logos/${platform}.png`}
                    alt={platform}
                    width={24}
                    height={24}
                    className="rounded"
                  />
                  {platform}
                </h2>
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {products.map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex flex-col gap-3 p-4 border rounded-lg hover:shadow-lg transition-shadow"
                      whileTap={{ scale: 0.95 }}
                    >
                      <Image
                        height={120}
                        width={120}
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-contain rounded mx-auto"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold line-clamp-2 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-lg font-bold text-green-600 mb-1">
                          {item.price}
                        </p>
                        {item.rating && (
                          <div className="flex items-center gap-1 mb-2">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm text-foreground/70">
                              {item.rating}
                            </span>
                            {item.reviews && (
                              <span className="text-xs text-foreground/50">
                                ({item.reviews})
                              </span>
                            )}
                          </div>
                        )}
                        <a
                          href={
                            platform === "flipkart"
                              ? `https://flipkart.com${item.link}`
                              : platform === "amazon"
                              ? `https://amazon.in${item.link}`
                              : item.link
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline text-sm"
                        >
                          View Product
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )
          )}
      </div>
    </div>
  );
};

export default FindProductsPage;
