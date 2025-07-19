import React from "react";
import { motion } from "framer-motion";

interface ProductNotFoundProps {
  platform: string;
}

const ProductNotFound: React.FC<ProductNotFoundProps> = ({ platform }) => {
  return (
    <motion.div
      className="col-span-full flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 className="text-lg font-medium text-gray-700 mb-1">
        No products found
      </h3>
      <p className="text-gray-500 text-center">
        We couldn&apos;t find any products matching your search criteria on{" "}
        {platform}.
      </p>
    </motion.div>
  );
};

export { ProductNotFound };
