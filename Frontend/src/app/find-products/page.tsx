"use client";

import SearchComponent from "@/components/search-component";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ProductNotFound } from "@/components/product-notfound";
import useSendRecentSearch from "@/hooks/useSendRecentSearch";
import { getCookie } from "@/utils/csrf";

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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const sendRecentSearch = useSendRecentSearch();

  // TODO: Send search query to backend and fetch results
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get("query");
      if (query) {
        setSearchQuery(query);
        handleSearch(query);
      }
    }
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      console.warn("Empty search query provided");
      return;
    }

    setLoading(true);
    setData(null);
    sendRecentSearch(query);

    try {
      const res = await fetch("/api/find-products", {
        method: "POST",
        body: JSON.stringify({ search_query: query }),
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken") || "",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const responseData = await res.json();
      setData(responseData);
      setSearchQuery(query);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      // You might want to show an error message to the user here
      setData({});
    } finally {
      setLoading(false);
    }
  };

  const hasResults = data && Object.keys(data).length > 0;
  const hasAnyProducts =
    hasResults && Object.values(data).some((products) => products.length > 0);

  return (
    <div className="flex flex-col items-center p-4 h-[calc(100vh-var(--navbar-height,57px))]">
      <SearchComponent redirect={true} onSearch={handleSearch} />

      {(hasResults || loading) && (
        <div className="w-full flex justify-between items-center mt-4">
          <h1 className="text-2xl font-bold">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : "Search Results"}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Sort by:</span>
            <select className="border rounded p-1">
              <option value="relevance">Relevance</option>
              <option value="price-low-to-high">Price: Low to High</option>
              <option value="price-high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>
      )}

      <div
        className="mt-4 overflow-scroll w-full"
        style={{ scrollbarWidth: "none" }}
      >
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="text-gray-500 ml-4">Loading products...</span>
          </div>
        )}

        {/* TODO: Make a separate loading component */}
        {!loading && hasResults && !hasAnyProducts && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                Try searching with different keywords
              </p>
            </div>
          </div>
        )}

        {/* Search results */}
        {!loading &&
          hasResults &&
          Object.entries(data).map(
            ([platform, products]: [string, Product[]]) => (
              <div key={platform} className="mb-8">
                <h2 className="text-xl font-bold mb-4 capitalize flex items-center gap-2">
                  <Image
                    src={`/logos/${platform}.png`}
                    alt={platform || "Platform Logo"}
                    width={24}
                    height={24}
                    className="rounded"
                    onError={(e) => {
                      // Fallback if logo image fails to load
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  {platform}
                </h2>
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {products.length > 0 ? (
                    products.map((item, index) => (
                      <motion.div
                        key={`${platform}-${index}`}
                        className="flex flex-col gap-3 p-4 border rounded-lg hover:shadow-lg transition-shadow"
                        whileTap={{ scale: 0.95 }}
                      >
                        <Image
                          height={120}
                          width={120}
                          src={item.image || "/placeholder-product.png"}
                          alt={item.title || "Product Image"}
                          className="w-full h-48 object-contain rounded mx-auto"
                          onError={(e) => {
                            // Fallback for broken product images
                            e.currentTarget.src = "/placeholder-product.png";
                          }}
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
                    ))
                  ) : (
                    <ProductNotFound platform={platform} />
                  )}
                </motion.div>
              </div>
            )
          )}
      </div>
    </div>
  );
};

export default FindProductsPage;
