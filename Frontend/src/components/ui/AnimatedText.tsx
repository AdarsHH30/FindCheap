"use client";
// TODO : fix this component so that last 4 searches are shown in the hero

import React from "react";
import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
  onSearch?: (searchTerm: string) => void;
  searchTerm?: string;
  isClickable?: boolean;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  delay = 0.3,
  duration = 0.3,
  className = "",
  onSearch,
  searchTerm,
  isClickable = false,
}) => {
  const handleClick = () => {
    if (isClickable && onSearch && searchTerm) {
      onSearch(searchTerm);
    }
  };

  const Component = isClickable ? motion.button : motion.p;
  const clickableClasses = isClickable
    ? "cursor-pointer bg-[var(--primary)] text-white hover:bg-var(--chart-3) transition-colors duration-200 hover:underline rounded-full px-4 py-2"
    : "";

  return (
    <Component
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration }}
      className={`${className} ${clickableClasses}`}
      onClick={isClickable ? handleClick : undefined}
      type={isClickable ? "button" : undefined}
    >
      {text}
    </Component>
  );
};

export default AnimatedText;
