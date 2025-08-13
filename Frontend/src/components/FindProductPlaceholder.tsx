import React, { useState, useEffect } from "react";

const ProductPlaceholder: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingDots, setLoadingDots] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    const dotsInterval = setInterval(() => {
      setLoadingDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 300);

    return () => {
      clearTimeout(timer);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center min-h-[800px] transition-opacity duration-300">
      {isLoading ? (
        <div className="animate-pulse">
          <div className="text-5xl mb-6">⏳</div>
          <h3 className="text-2xl font-semibold mb-2">Loading{loadingDots}</h3>
          <p className="text-gray-500 text-sm">Getting things ready for you</p>
        </div>
      ) : (
        <>
          <div className="text-7xl mb-8 animate-bounce">🔍</div>
          <h2 className="text-3xl font-bold mb-4 transition-all duration-300 ease-in-out hover:text-blue-600">
            Search for products
          </h2>
          <p className="text-gray-600 mb-8 max-w-md text-lg">
            Enter a product name above to find the best deals across various
            platforms.
          </p>
          <div className="text-sm text-gray-400 mt-2">
            We compare prices to help you save money
          </div>
        </>
      )}
    </div>
  );
};

export default ProductPlaceholder;
