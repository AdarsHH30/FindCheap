import React from "react";
export const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-top h-screen bg-gray-200">
      <h1 className="relative h-64 bg-gray-100 top-0 right-0">
        Find The Best Deals
      </h1>
      <p className="hero-subtitle">
        Discover amazing content and connect with us!
      </p>
      <button className="hero-">Get Started</button>
    </div>
  );
};
