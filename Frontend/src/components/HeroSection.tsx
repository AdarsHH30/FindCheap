"use client";

import React from "react";
import SearchComponent from "./search-component";
import { ReactTyped } from "react-typed";
import InfiniteScrollingLogosAnimation from "./ui/Infinite-Scrolling-Logos-Animation";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className=" h-full flex  p-20 gap-10 ">
      <div className="h-full flex flex-col justify-center items-left w-3/4 gap-5 p-10">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-6xl font-bold text-left"
        >
          Find the Cheapest Prices Across All Stores
        </motion.h1>
        <ReactTyped
          strings={["Compare prices from 100+ retailers in seconds"]}
          className="text-2xl text-foreground/80"
        />
        <SearchComponent />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          Wireless earbuds - smartwatch - yoga mat -laptop - gaming console
        </motion.p>
        <InfiniteScrollingLogosAnimation />
      </div>
      <div className="bg-teal-500 opacity-50 backdrop-blur-2xl h-full w-1/4" />
    </section>
  );
};

export default HeroSection;
