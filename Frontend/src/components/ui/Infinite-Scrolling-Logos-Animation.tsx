"use client";

import { DotIcon } from "@radix-ui/react-icons";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const CompanyLogoData: Array<{ src: string; alt: string }> = [
  { src: "/logos/amazon.png", alt: "Amazon Logo" },
  { src: "/logos/flipkart.png", alt: "Flipkart Logo" },
  { src: "/logos/shopify.png", alt: "Shopify Logo" },
  { src: "/logos/walmart.png", alt: "Walmart Logo" },
  { src: "/logos/snapdeal.png", alt: "snapdeal Logo" },
];

const InfiniteScrollingLogosAnimation = () => {
  return (
    <div className="container p-5">
      <div className="flex relative overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-10  before:to-transparent before:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-10 after:to-transparent after:content-['']">
        <motion.div
          transition={{
            duration: 8,
            ease: [
              "linear",
              "easeInOut",
              "circInOut",
              "backInOut",
              "anticipate",
            ],

            repeat: Infinity,
          }}
          initial={{ translateX: -1 }}
          animate={{ translateX: "-50%" }}
          className="flex flex-none gap-10 pr-14"
        >
          {[...new Array(2)].fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {CompanyLogoData.map(({ src, alt }, index) => (
                <Image
                  key={`first-${index}`}
                  src={src}
                  alt={alt}
                  width={100}
                  height={100}
                  className="h-16 w-auto flex-none"
                />
              ))}
              {CompanyLogoData.map(({ src, alt }, index) => (
                <Image
                  key={`second-${index}`}
                  src={src}
                  alt={alt}
                  width={100}
                  height={100}
                  className="h-16 w-auto flex-none"
                />
              ))}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default InfiniteScrollingLogosAnimation;
