"use client";

import React from "react";
import SearchComponent from "./search-component";
import { ReactTyped } from "react-typed";
import InfiniteScrollingLogosAnimation from "./ui/Infinite-Scrolling-Logos-Animation";
import { motion } from "framer-motion";
import ModelViewer from "./ModelViewer";
import AnimatedText from "./ui/AnimatedText";
import { useRouter } from "next/navigation";
import PriceComparisonCard from "./PriceComparisonCard";

const HeroSection = () => {
  const router = useRouter();

  const handleSearch = (searchTerm: string) => {
    router.push(`/find-products?query=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <section className="flex flex-col lg:flex-row p-4 md:p-10 lg:p-20 gap-6 lg:gap-10">
      <div className="flex flex-col justify-center items-center lg:items-start w-full lg:w-3/4 gap-4 lg:gap-5 p-2 md:p-6 lg:p-10">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl md:text-4xl lg:text-6xl font-bold text-center lg:text-left"
        >
          Find the Cheapest Prices Across All Stores
        </motion.h1>
        <ReactTyped
          strings={["Compare prices from 100+ retailers in seconds"]}
          className="text-lg md:text-xl lg:text-2xl text-foreground/80 text-center lg:text-left"
        />
        <SearchComponent redirect={true} />
        <div className="flex flex-wrap justify-center lg:justify-start gap-2 text-base md:text-lg">
          {[
            "Wireless earbuds",
            "smartwatch",
            "yoga mat",
            "laptop",
            "gaming console",
          ].map((item, index) => (
            <React.Fragment key={item}>
              <AnimatedText
                text={item}
                delay={0.3 + index * 0.1}
                isClickable={true}
                searchTerm={item}
                onSearch={handleSearch}
                className="text-foreground/70"
              />
              {index < 4 && <span className="text-foreground/50">-</span>}
            </React.Fragment>
          ))}
        </div>
        <InfiniteScrollingLogosAnimation />
      </div>
      <div className="flex w-full lg:w-1/4 h-[300px] md:h-[400px] lg:h-full mt-6 lg:mt-0">
        <ModelViewer />
      </div>
    </section>
  );
};

export default HeroSection;
