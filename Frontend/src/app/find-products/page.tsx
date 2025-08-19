"use client";

import SearchComponent from "@/components/search-component";
import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ProductNotFound } from "@/components/product-notfound";
import useSendRecentSearch from "@/hooks/useSendRecentSearch";
import { getCookie } from "@/utils/csrf";
import { Product, SearchResults } from "@/types/product";
import Footer01Page from "@/components/Footer/footer";
import ProductPlaceholder from "@/components/FindProductPlaceholder";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import TruckLoader from "@/components/LoadingAnimation";

const FindProductsPage = () => {
  const [data, setData] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const sendRecentSearch = useSendRecentSearch();

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
      setData({});
    } finally {
      setLoading(false);
    }
  };

  const hasResults = data && Object.keys(data).length > 0;
  const hasAnyProducts =
    hasResults && Object.values(data).some((products) => products.length > 0);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center px-1 sm:px-2 lg:px-3 xl:px-4 py-4 max-w-full mx-auto">
        <div className="w-full max-w-2xl">
          <SearchComponent redirect={true} onSearch={handleSearch} />
        </div>

        {!searchQuery && !loading && !data && <ProductPlaceholder />}

        {(hasResults || loading) && (
          <div className="w-full  flex flex-col sm:flex-row sm:justify-between mt-6 gap-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold sm:text-left">
              {loading ? (
                <>
                  Searching for{" "}
                  <span className="text-primary">
                    {searchQuery.toUpperCase()}
                  </span>
                  ...
                </>
              ) : searchQuery ? (
                <>
                  Search Results for{" "}
                  <span className="text-primary">
                    {searchQuery.toUpperCase()}
                  </span>{" "}
                </>
              ) : (
                "Search Results"
              )}
            </h1>
          </div>
        )}

        <div
          className="mt-4 sm:mt-10 overflow-y-auto w-full flex-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading && (
            <div className="flex justify-center items-center relative-center">
              <TruckLoader />
            </div>
          )}

          {!loading && hasResults && !hasAnyProducts && (
            <motion.div
              className="flex justify-center items-center h-64"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center px-4">
                <h3 className="text-lg sm:text-xl font-semibold text-muted-foreground mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground/70 text-sm sm:text-base">
                  Try searching with different keywords
                </p>
              </div>
            </motion.div>
          )}

          {/* Search results */}

          {!loading &&
            hasResults &&
            Object.entries(data).map(
              ([platform, products]: [string, Product[]], platformIndex) => (
                <motion.div
                  key={platform}
                  className="mb-6 sm:mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: platformIndex * 0.15,
                    ease: "easeOut",
                  }}
                >
                  <motion.h2
                    className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 capitalize flex items-center gap-2 px-2 sm:px-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: platformIndex * 0.15 + 0.1,
                      ease: "easeOut",
                    }}
                  >
                    <Image
                      src={`/logos/${platform}.png`}
                      alt={platform || "Platform Logo"}
                      width={20}
                      height={20}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    {platform}
                  </motion.h2>
                  <motion.div
                    className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-6 px-1 sm:px-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      staggerChildren: 0.1,
                      delayChildren: 0.1,
                    }}
                  >
                    {products.length > 0 ? (
                      products.map((item, index) => (
                        <motion.div
                          key={`${platform}-${index}`}
                          className="flex flex-col gap-2 sm:gap-3 p-3 sm:p-4 shadow-2xl rounded-lg hover:shadow-lg transition-all duration-200 bg-card border"
                          initial={{ opacity: 0, y: 30, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{
                            duration: 0.4,
                            ease: [0.25, 0.46, 0.45, 0.94],
                            delay: index * 0.05,
                          }}
                          whileTap={{
                            scale: 0.95,
                            transition: { duration: 0.1, ease: "easeOut" },
                          }}
                          whileHover={{
                            y: -4,
                            scale: 1.02,
                            transition: { duration: 0.2, ease: "easeOut" },
                          }}
                        >
                          <motion.div
                            className="relative aspect-square w-full overflow-hidden rounded"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 + 0.2 }}
                          >
                            <Image
                              fill
                              src={item.image || "/placeholder-product.png"}
                              alt={item.title || "Product Image"}
                              className="object-contain rounded transition-opacity duration-300"
                              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "/placeholder-product.png";
                              }}
                            />
                          </motion.div>
                          <div className="flex-1 flex flex-col">
                            <h3 className="flex flex-col text-xs sm:text-sm font-semibold line-clamp-2 mb-1 sm:mb-2 min-h-[2.5rem] sm:min-h-[3rem]">
                              {item.title}
                            </h3>
                            <p className="text-sm sm:text-lg font-bold text-primary mb-1">
                              {item.price}
                            </p>
                            {item.rating && (
                              <div className="flex items-center gap-1 mb-2">
                                <span className="text-accent text-xs sm:text-sm">
                                  ⭐
                                </span>
                                <span className="text-xs sm:text-sm text-foreground/70">
                                  {item.rating}
                                </span>
                                {item.reviews && (
                                  <span className="text-xs text-foreground/50 truncate">
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
                              className="text-accent hover:underline text-xs sm:text-sm mt-auto inline-block py-1"
                            >
                              View Product
                            </a>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full">
                        <ProductNotFound platform={platform} />
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )
            )}
        </div>
      </div>

      <Footer01Page />
    </div>
  );
};
export default FindProductsPage;
