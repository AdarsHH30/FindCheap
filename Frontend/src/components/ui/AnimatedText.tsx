"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { useAuthStatus } from "@/hooks/useAuthStatus";
// TODO : make sure it takes the data from recent searches
interface AnimatedTextProps {
  text?: string;
  delay?: number;
  duration?: number;
  className?: string;
  onSearch?: (searchTerm: string) => void;
  searchTerm?: string;
  isClickable?: boolean;
  fetchRecentSearches?: boolean;
  defaultSearches?: string[];
  index?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  delay = 0.3,
  duration = 0.3,
  className = "",
  onSearch,
  searchTerm,
  isClickable = false,
  fetchRecentSearches = false,
  defaultSearches = [
    "Wireless earbuds",
    "smartwatch",
    "yoga mat",
    "laptop",
    "gaming console",
  ],
  index = 0,
}) => {
  const { isLoggedIn, user } = useAuthStatus();
  const { searches, loading, error } = useRecentSearches(
    fetchRecentSearches && isLoggedIn ? user?.id || "" : ""
  );

  const handleClick = () => {
    if (isClickable && onSearch) {
      const termToSearch = searchTerm || displayText;
      if (termToSearch) {
        onSearch(termToSearch);
      }
    }
  };

  const Component = isClickable ? motion.button : motion.p;
  const clickableClasses = isClickable
    ? "cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 hover:underline rounded-full px-4 py-2"
    : "";

  let displayText = text;

  if (
    fetchRecentSearches &&
    searches &&
    searches.length > 0 &&
    index < searches.length
  ) {
    displayText = searches[index]?.term;
  } else if (!displayText && defaultSearches?.length > 0) {
    displayText = defaultSearches[index % defaultSearches.length];
  }

  if (!displayText) return null;

  return (
    <Component
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration }}
      className={`${className} ${clickableClasses}`}
      onClick={isClickable ? handleClick : undefined}
      type={isClickable ? "button" : undefined}
    >
      {displayText}
    </Component>
  );
};

export default AnimatedText;
