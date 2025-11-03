"use client";

import SearchComponent from "@/components/search-component";
import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ProductNotFound } from "@/components/product-notfound";
import useSendRecentSearch from "@/hooks/useSendRecentSearch";
// import { getCookie } from "@/utils/csrf";
import { Product, SearchResults } from "@/types/product";
import Footer01Page from "@/components/Footer/footer";
import ProductPlaceholder from "@/components/FindProductPlaceholder";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
// Skeletons will be rendered inline per-platform grid
import { useScrapeStream, SiteChunk } from "@/hooks/useScrapeStream";

const FindProductsPage = () => {
  const [data, setData] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const sendRecentSearch = useSendRecentSearch();

  const EXPECTED_PLATFORMS = React.useMemo(
    () => ["amazon", "flipkart", "snapdeal", "jiomart", "meesho", "myntra"],
    []
  );
  const CARDS_PER_PLATFORM = 6;

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
    setData({});
    sendRecentSearch(query);
    setSearchQuery(query);
  };

  // Memoize callbacks to avoid re-connecting the stream on every render
  const onChunk = React.useCallback((chunk: SiteChunk) => {
    setData((prev) => {
      const current = (prev || {}) as SearchResults;
      return {
        ...current,
        [chunk.site]: (chunk.results as unknown as Product[]) || [],
      };
    });
  }, []);

  const onDone = React.useCallback(() => {
    setLoading(false);
  }, []);

  // Incrementally update results using SSE stream when searchQuery is set
  useScrapeStream(searchQuery || null, onChunk, onDone);

  const hasResults = data && Object.keys(data).length > 0;
  const hasAnyProducts =
    hasResults && Object.values(data).some((products) => products.length > 0);

  return (
    <div className="min-h-screen flex flex-col w-screen">
      <div className="flex-1 flex flex-col items-center px-3 sm:px-6 lg:px-8 py-3 w-full">
        <div className="w-full max-w-3xl mb-3">
          <SearchComponent redirect={true} onSearch={handleSearch} />
        </div>

        {!searchQuery && !loading && !data && <ProductPlaceholder />}

        {(hasResults || loading) && (
          <div className="w-full mx-auto flex flex-col sm:flex-row left mb-3 gap-2 px-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-center sm:text-left">
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

        <div className="overflow-y-auto w-full mx-auto flex-1 px-1">
          {/* Inline per-platform skeletons mixed with products */}

          {hasResults && !hasAnyProducts && !loading && (
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

          {/* Products with per-platform skeletons filling remaining slots */}
          {(loading || hasResults) && (
            <>
              {EXPECTED_PLATFORMS.map((platform, platformIndex) => {
                const products = ((data?.[platform] as Product[]) || []).slice(
                  0,
                  CARDS_PER_PLATFORM
                );
                const shouldRenderPlatform = loading || products.length > 0;
                if (!shouldRenderPlatform) return null;

                const remaining = Math.max(
                  0,
                  CARDS_PER_PLATFORM - products.length
                );

                return (
                  <motion.div
                    key={platform}
                    className="mb-6 sm:mb-8 w-full"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: platformIndex * 0.1,
                      ease: "easeOut",
                    }}
                  >
                    <motion.h2
                      className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 capitalize flex items-center gap-2 px-1 sm:px-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <Image
                        src={`/logos/${platform}.png`}
                        alt={platform || "Platform Logo"}
                        width={20}
                        height={20}
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded shadow-sm"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      {platform}
                    </motion.h2>

                    <motion.div
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 md:gap-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                        staggerChildren: 0.1,
                        delayChildren: 0.05,
                      }}
                    >
                      {/* Real products first (appear at the top) */}
                      {products.map((item, index) => (
                        <motion.div
                          key={`${platform}-${index}`}
                          className="flex flex-col gap-2 p-3 sm:p-3.5 shadow-sm hover:shadow-xl rounded-lg transition-all duration-300 bg-card border border-border/40 hover:border-primary/40 overflow-hidden group backdrop-blur-sm"
                          initial={{ opacity: 0, y: 30, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{
                            duration: 0.35,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                          whileTap={{ scale: 0.98 }}
                          whileHover={{ y: -4, scale: 1.02 }}
                        >
                          <motion.div
                            className="relative aspect-square w-full overflow-hidden rounded-lg bg-gradient-to-br from-muted/20 to-muted/40 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <Image
                              fill
                              src={item.image || "/placeholder-product.png"}
                              alt={item.title || "Product Image"}
                              className="object-contain transition-all duration-300 group-hover:scale-110 p-2"
                              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "/placeholder-product.png";
                              }}
                            />
                          </motion.div>
                          <div className="flex-1 flex flex-col gap-1 text-center sm:text-left">
                            <h3 className="text-xs font-medium line-clamp-2 text-foreground leading-tight min-h-[1.8rem]">
                              {item.title}
                            </h3>
                            <p className="text-sm sm:text-base font-bold text-primary">
                              {item.price}
                            </p>
                            {item.rating && (
                              <div className="flex items-center justify-center sm:justify-start gap-1">
                                <div className="flex items-center gap-0.5 bg-accent/15 px-1.5 py-0.5 rounded-full">
                                  <span className="text-accent text-[10px]">
                                    ⭐
                                  </span>
                                  <span className="text-[10px] font-semibold text-foreground">
                                    {typeof item.rating === 'string' 
                                      ? item.rating.split(' ')[0]
                                      : item.rating}
                                  </span>
                                </div>
                                {item.reviews && (
                                  <span className="text-[10px] text-muted-foreground truncate">
                                    ({typeof item.reviews === 'string' 
                                      ? item.reviews.replace(/\s*bought/i, '').trim()
                                      : item.reviews})
                                  </span>
                                )}
                              </div>
                            )}
                            <a
                              href={(() => {
                                const baseUrls = {
                                  flipkart: "https://flipkart.com",
                                  amazon: "https://amazon.in/",
                                  meesho: "https://meesho.com/",
                                  ajio: "https://ajio.com/",
                                  myntra: "https://myntra.com/",
                                  snapdeal: "https://snapdeal.com/",
                                };
                                const baseUrl =
                                  baseUrls[platform as keyof typeof baseUrls] ||
                                  "";
                                if (!item.link) return baseUrl;
                                if (item.link.startsWith("http"))
                                  return item.link;
                                return `${baseUrl}${item.link}`;
                              })()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 font-medium text-[10px] mt-auto inline-flex items-center justify-center sm:justify-start gap-0.5 py-1 transition-colors"
                            >
                              View
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M7 17L17 7M17 7H7M17 7V17" />
                              </svg>
                            </a>
                          </div>
                        </motion.div>
                      ))}

                      {/* Skeletons for remaining slots (stay at the bottom) */}
                      {loading &&
                        remaining > 0 &&
                        Array.from({ length: remaining }).map((_, idx) => (
                          <div
                            key={`skeleton-${platform}-${idx}`}
                            className="flex flex-col gap-2 p-3 sm:p-3.5 rounded-lg bg-card border border-border/40"
                          >
                            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gradient-to-br from-muted/20 to-muted/40 animate-pulse" />
                            <div className="flex-1 flex flex-col gap-1 text-center sm:text-left">
                              {/* Title skeleton - 2 lines with min-height */}
                              <div className="min-h-[1.8rem] space-y-1">
                                <div className="h-2.5 bg-muted/40 rounded w-full animate-pulse" />
                                <div className="h-2.5 bg-muted/40 rounded w-4/5 mx-auto sm:mx-0 animate-pulse" />
                              </div>
                              {/* Price skeleton */}
                              <div className="h-3.5 bg-muted/40 rounded w-1/3 mx-auto sm:mx-0 animate-pulse" />
                              {/* Rating skeleton */}
                              <div className="h-4 bg-muted/40 rounded-full w-1/3 mx-auto sm:mx-0 animate-pulse" />
                              {/* Button skeleton */}
                              <div className="h-3.5 bg-muted/40 rounded w-1/4 mx-auto sm:mx-0 animate-pulse mt-auto" />
                            </div>
                          </div>
                        ))}
                    </motion.div>
                  </motion.div>
                );
              })}
            </>
          )}
        </div>
      </div>
      <Footer01Page />
    </div>
  );
};
export default FindProductsPage;
