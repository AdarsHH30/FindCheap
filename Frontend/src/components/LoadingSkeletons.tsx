"use client";

import React from "react";

type Props = {
  platforms?: string[];
  cardsPerPlatform?: number;
};

export default function LoadingSkeletons({
  platforms = ["amazon", "flipkart", "snapdeal", "jiomart", "meesho", "myntra"],
  cardsPerPlatform = 7,
}: Props) {
  return (
    <div className="space-y-6">
      {platforms.map((platform) => (
        <div key={platform} className="ml-2 mb-6 sm:mb-8">
          <div className="flex items-center ml-2 gap-3 mb-3 px-2 sm:px-0">
            <div className="w-6 h-6 rounded bg-gray-300 animate-pulse" />
            <div className="h-4 w-32 rounded bg-gray-300 animate-pulse" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 md:gap-6 px-2 sm:px-4">
            {Array.from({ length: cardsPerPlatform }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2 p-3 sm:p-3.5 rounded-lg bg-card border border-border/40"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gradient-to-br from-muted/20 to-muted/40 animate-pulse" />
                <div className="flex-1 flex flex-col gap-1 text-center sm:text-left">
                  {/* Title skeleton - 2 lines with min-height */}
                  <div className="min-h-[1.8rem] space-y-1">
                    <div className="h-2.5 bg-muted/40 rounded w-full animate-pulse" />
                    <div className="h-2.5 bg-muted/40 rounded w-4/5 mx-auto sm:mx-0 animate-pulse" />
                  </div>
                  {/* Price skeleton */}
                  <div className="h-3.5 bg-muted/40 rounded w-1/3 mx-auto sm:mx-0 animate-pulse" />
                  {/* Rating skeleton */}
                  <div className="h-4 bg-muted/40 rounded-full w-1/3 mx-auto sm:mx-0 animate-pulse" />
                  {/* Button skeleton */}
                  <div className="h-3.5 bg-muted/40 rounded w-1/4 mx-auto sm:mx-0 animate-pulse mt-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
