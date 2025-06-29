import React from "react";
import SearchComponent from "./search-component";
import InfiniteScrollingLogosAnimation from "./ui/Infinite-Scrolling-Logos-Animation";

const HeroSection = () => {
  return (
    <section className=" h-full flex  p-20 gap-10 ">
      <div className="h-full flex flex-col justify-center items-left w-3/4 gap-5 p-10">
        <h1 className="text-6xl font-bold text-left">
          Find the Cheapest Prices Across All Stores
        </h1>
        <p className="text-2xl text-foreground/80">
          Compare prices from 100+ retailers in seconds
        </p>
        <SearchComponent />
        <p>Wireless earbuds - smartwatch - yoga mat</p>
        <InfiniteScrollingLogosAnimation />
      </div>
      {/* what is the point of this div? */}
      <div className="bg-teal-500 opacity-50 backdrop-blur-2xl h-full w-1/4" />
    </section>
  );
};

export default HeroSection;
