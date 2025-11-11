"use client";

import { useState, useEffect } from "react";
import SearchComponent from "./search-component";
import { ReactTyped } from "react-typed";
import InfiniteScrollingLogosAnimation from "./ui/Infinite-Scrolling-Logos-Animation";
import { motion } from "framer-motion";
import ModelViewer from "./ModelViewer";
import AnimatedText from "./ui/AnimatedText";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import Skeleton from "@mui/material/Skeleton";

const HeroSection = () => {
  const router = useRouter();
  const { isLoggedIn, user } = useAuthStatus();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (searchTerm: string) => {
    router.push(`/find-products?query=${encodeURIComponent(searchTerm)}`);
  };
  const defaultSearches = [
    "Wireless earbuds",
    "smartwatch",
    "yoga mat",
    "laptop",
    // "gaming console",
  ];
  const searchChipIndices = Array.from(
    { length: defaultSearches.length },
    (_, index) => index
  );
  const showRecentSearches = Boolean(isLoggedIn && user);
  const sampleComparison = {
    productName: "Wireless Earbuds",
    prices: [
      { platform: "Amazon", price: "$95.00", isLowest: true },
      { platform: "Best Buy", price: "$104.99" },
      { platform: "Target", price: "$107.50" },
    ],
  };

  return (
    <>
      <section className="relative isolate overflow-hidden mt-0">
        <div className="pointer-events-none absolute -top-24 left-[-10%] h-72 w-72 rounded-full bg-primary/20 blur-3xl lg:h-96 lg:w-96" />
        <div className="pointer-events-none absolute -bottom-32 right-[-15%] h-80 w-80 rounded-full bg-primary/10 blur-3xl lg:h-[420px] lg:w-[420px]" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pt-12 pb-10 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16">
            <div className="flex w-full flex-col items-center gap-6 text-center lg:items-start lg:text-left">
              {loading ? (
                <div className="flex w-full max-w-2xl flex-col gap-6">
                  <Skeleton
                    variant="text"
                    width="40%"
                    height={30}
                    animation="wave"
                    className="mx-auto lg:mx-0"
                  />
                  <Skeleton
                    variant="text"
                    width="90%"
                    height={68}
                    animation="wave"
                    className="mx-auto lg:mx-0"
                  />
                  <Skeleton
                    variant="text"
                    width="75%"
                    height={48}
                    animation="wave"
                    className="mx-auto lg:mx-0"
                  />
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={56}
                    animation="wave"
                    className="mx-auto w-full max-w-xl rounded-xl lg:mx-0"
                  />
                  <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                    {searchChipIndices.map((index) => (
                      <Skeleton
                        key={`search-skeleton-${index}`}
                        variant="rectangular"
                        width={120}
                        height={36}
                        animation="wave"
                        className="rounded-full"
                      />
                    ))}
                  </div>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={72}
                    animation="wave"
                    className="rounded-2xl"
                  />
                </div>
              ) : (
                <>
                  {/* <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                  >
                    Smarter shopping starts here
                  </motion.span> */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-3xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl"
                  >
                    Where&apos;s it Cheapest? We&apos;ll Tell You.
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-2xl text-md text-foreground/80 md:text-xl lg:text-2xl"
                  >
                    <ReactTyped
                      strings={[
                        "Price check every store in seconds.",
                        "Catch drops and stack coupons before you buy.",
                      ]}
                      typeSpeed={36}
                      backSpeed={18}
                      backDelay={3200}
                      loop
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="w-full max-w-xl"
                  >
                    <SearchComponent redirect={true} />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    className="text-sm text-muted-foreground"
                  >
                    Try a trending search or jump back into your recent finds.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex w-full flex-wrap justify-center gap-3 lg:justify-start"
                  >
                    {searchChipIndices.map((index) => {
                      const defaultLabel = defaultSearches[index];
                      const key = showRecentSearches
                        ? `recent-${index}`
                        : `default-${defaultLabel}`;
                      return (
                        <AnimatedText
                          key={key}
                          text={!showRecentSearches ? defaultLabel : undefined}
                          delay={0.4 + index * 0.08}
                          defaultSearches={defaultSearches}
                          fetchRecentSearches={showRecentSearches}
                          index={index}
                          isClickable={true}
                          onSearch={handleSearch}
                          className="!bg-background/80 !text-foreground border border-border/60 shadow-sm transition-shadow hover:shadow-md hover:!bg-primary hover:!text-primary-foreground"
                        />
                      );
                    })}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.45 }}
                    className="w-full"
                  >
                    <InfiniteScrollingLogosAnimation />
                  </motion.div>
                </>
              )}
            </div>
            <div className="relative flex w-full justify-center lg:justify-end">
              {loading ? (
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  className="h-[300px] w-full max-w-sm rounded-3xl sm:h-[360px] sm:max-w-md lg:h-[520px] lg:max-w-xl"
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="relative w-full max-w-sm sm:max-w-md lg:max-w-xl"
                >
                  <ModelViewer
                    className="shadow-2xl"
                    priceComparison={sampleComparison}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
