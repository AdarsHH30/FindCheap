import React from "react";
export const Hero = () => {
  return (
    <div className="flex flex-col items-center w-full top-0 right-0 absolute">
      <h1 className="text-3xl font-bold mt-8">Find The Best Deals</h1>
      <p className="hero-subtitle mt-4">
        Discover amazing content and connect with us!
      </p>
      <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Get Started
      </button>
    </div>
  );
};
