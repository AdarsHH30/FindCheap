"use client";

import React from "react";
import SearchComponent from "./search-component";
import { ReactTyped } from "react-typed";
import InfiniteScrollingLogosAnimation from "./ui/Infinite-Scrolling-Logos-Animation";
import { motion } from "framer-motion";
import ModelViewer from "./ModelViewer";
import AnimatedText from "./ui/AnimatedText";

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
        <SearchComponent redirect={true} />
        <AnimatedText text="Wireless earbuds - smartwatch - yoga mat -laptop - gaming console" />
        <InfiniteScrollingLogosAnimation />
      </div>
      <div className="relative w-1/4 h-full">
        <ModelViewer />
        <div className="absolute top-[60%] left-[40%] -translate-y-1/2 bg-white/95 rounded-xl shadow-xl px-4 py-3 w-52">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            wireless earbuds
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex justify-between">
              <span>eBay</span>{" "}
              <span className="text-primary font-semibold">$124</span>
            </li>
            <li className="flex justify-between">
              <span>Amazon</span> <span>$189</span>
            </li>
            <li className="flex justify-between">
              <span>Target</span> <span>$149</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
