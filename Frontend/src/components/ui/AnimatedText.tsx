"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  delay = 0.3,
  duration = 0.3,
  className = "",
}) => {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration }}
      className={className}
    >
      {text}
    </motion.p>
  );
};

export default AnimatedText;
