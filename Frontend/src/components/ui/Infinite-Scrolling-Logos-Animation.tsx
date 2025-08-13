"use client";

import React from "react";
import { motion } from "framer-motion";

const CompanyLogoData = [
  { src: "/logos/amazon.png", alt: "Amazon Logo" },
  { src: "/logos/flipkart.png", alt: "Flipkart Logo" },
  { src: "/logos/shopify.png", alt: "Shopify Logo" },
  { src: "/logos/jiomart.png", alt: "Jio mart Logo" },
  { src: "/logos/snapdeal.png", alt: "Snap deal Logo" },
  { src: "/logos/walmart.png", alt: "Walmart Logo" },
  { src: "/logos/meesho.png", alt: "Meesho Logo" },
  { src: "/logos/myntra.png", alt: "Myntra Logo" },
];

const InfiniteScrollingLogosAnimation = () => {
  const duplicatedLogos = [...CompanyLogoData, ...CompanyLogoData];

  return (
    <div className="container p-5 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden"
      >
        <div className="absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none" />

        <motion.div
          animate={{ x: "-50%" }}
          transition={{
            duration: 25,
            ease: "linear",
            repeat: Infinity,
          }}
          className="flex gap-0 w-max py-4"
        >
          {duplicatedLogos.map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 h-20 w-32 flex items-center justify-center bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-12 w-auto object-contain brightness-100 contrast-100 group-hover:scale-110 transition-transform duration-300 dark:brightness-90 dark:contrast-110"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = `data:image/svg+xml,${encodeURIComponent(
                    `<svg width="48" height="48" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" fill="hsl(var(--muted))" rx="6" stroke="hsl(var(--border))" stroke-width="1"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="hsl(var(--muted-foreground))" font-family="system-ui" font-size="10" font-weight="500">${
                      logo.alt.split(" ")[0]
                    }</text></svg>`
                  )}`;
                }}
              />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default InfiniteScrollingLogosAnimation;
