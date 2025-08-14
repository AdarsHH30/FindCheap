"use client";

import React from "react";
import { motion } from "framer-motion";

interface PriceItem {
  platform: string;
  price: string;
  isLowest?: boolean;
}

interface PriceComparisonCardProps {
  productName: string;
  prices: PriceItem[];
  className?: string;
}

const PriceComparisonCard: React.FC<PriceComparisonCardProps> = ({
  productName,
  prices,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`absolute top-[60%] left-[50%] lg:left-[40%] -translate-x-1/2 lg:-translate-x-0 -translate-y-1/2 bg-card/95 backdrop-blur-sm rounded-xl shadow-xl px-4 py-3 w-52 border ${className}`}
    >
      <h3 className="text-sm font-semibold text-card-foreground mb-2">
        {productName}
      </h3>
      <ul className="text-sm text-muted-foreground space-y-1">
        {prices.map((item, index) => (
          <li key={index} className="flex justify-between">
            <span>{item.platform}</span>
            <span
              className={
                item.isLowest ? "text-primary font-semibold" : "text-muted-foreground"
              }
            >
              {item.price}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default PriceComparisonCard;
