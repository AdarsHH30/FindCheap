"use client";

import React, { useState, useEffect } from "react";
import SearchComponent from "./search-component";
import { ReactTyped } from "react-typed";
import InfiniteScrollingLogosAnimation from "./ui/Infinite-Scrolling-Logos-Animation";
import { motion } from "framer-motion";
import ModelViewer from "./ModelViewer";
import AnimatedText from "./ui/AnimatedText";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import PriceComparisonCard from "@/components/PriceComparisonCard";
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
    "gaming console",
  ];

  return (
    <>
      <section className="flex flex-col lg:flex-row p-4 md:p-0 lg:p-20 gap-6 lg:gap-10">
        <div className="flex flex-col justify-center items-center lg:items-start w-full lg:w-3/4 gap-5 lg:gap-5 p-2 md:p-6 lg:p-10">
          {loading ? (
            <>
              <Skeleton
                variant="text"
                width="80%"
                height={60}
                animation="wave"
              />
              <Skeleton
                variant="text"
                width="60%"
                height={40}
                animation="wave"
              />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={56}
                animation="wave"
              />
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 w-full">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <React.Fragment key={`skeleton-${index}`}>
                      <Skeleton
                        variant="text"
                        width={80}
                        height={30}
                        animation="wave"
                      />
                      {index < 4 && <span className="mx-1">•</span>}
                    </React.Fragment>
                  ))}
              </div>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={100}
                animation="wave"
              />
            </>
          ) : (
            <>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl md:text-4xl lg:text-6xl font-bold text-center lg:text-left"
              >
                Get The Right Price, Right Now ....
              </motion.h1>
              <ReactTyped
                strings={["Compare prices from 5+ retailers in seconds"]}
                className="text-lg md:text-xl p-5 lg:text-2xl text-foreground/80 text-center lg:text-left"
              />
              <SearchComponent redirect={true} />
              <div className="flex flex-wrap mt-8 justify-center lg:justify-start gap-3 text-base md:text-lg">
                {isLoggedIn && user
                  ? defaultSearches.map((_, index) => (
                      <React.Fragment key={`recent-${index}`}>
                        <AnimatedText
                          fetchRecentSearches={true}
                          isClickable={true}
                          onSearch={handleSearch}
                          className="text-foreground/70"
                          delay={0.3 + index * 0.1}
                          index={index}
                        />
                        {index < 4 && <span className="mx-1"></span>}
                      </React.Fragment>
                    ))
                  : defaultSearches.map((item, index) => (
                      <React.Fragment key={item}>
                        <AnimatedText
                          text={item}
                          delay={0.3 + index * 0.1}
                          isClickable={true}
                          onSearch={handleSearch}
                          className="text-foreground/70"
                        />
                        {index < 4 && <span className="mx-1"></span>}
                      </React.Fragment>
                    ))}
              </div>
            </>
          )}
        </div>
        <div className="flex w-full lg:w-1/3 h-[300px] md:h-[400px] lg:h-full mt-6 lg:mt-0">
          {loading ? (
            <Skeleton
              variant="circular"
              width="100%"
              height="100%"
              animation="wave"
            />
          ) : (
            <>
              <ModelViewer />
              <div className="flex top-5 left-4 right-0 justify-start items-start">
                {/* <PriceComparisonCard
                  productName="Wireless Earbuds"
                  prices={[
                    { platform: "Amazon", price: "$99.99", isLowest: true },
                    { platform: "Best Buy", price: "$109.99" },
                    { platform: "Walmart", price: "$95.00" },
                    { platform: "Target", price: "$102.50" },
                  ]}
                /> */}
              </div>
            </>
          )}
        </div>
      </section>
      <InfiniteScrollingLogosAnimation />
    </>
  );
};

export default HeroSection;
