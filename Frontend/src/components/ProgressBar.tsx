"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  isLoading: boolean;
  className?: string;
  variant?: "primary" | "success" | "secondary";
  duration?: number;
}

const variantClasses = {
  primary: "bg-chart-3",
  success: "bg-success",
  secondary: "bg-secondary",
};

export function ProgressBar({
  isLoading,
  className,
  variant = "primary",
  duration = 2000,
}: ProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, duration / 20);

    return () => clearInterval(interval);
  }, [isLoading, duration]);

  useEffect(() => {
    if (!isLoading && progress > 0) {
      setProgress(100);
      const timeout = setTimeout(() => setProgress(0), 500);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, progress]);

  if (progress === 0) return null;

  return (
    <motion.div
      className={cn(
        "fixed top-0 left-0 right-[-5px] z-50 h-1 bg-muted",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={cn(
          "h-full transition-all duration-300 ease-out",
          variantClasses[variant]
        )}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      <motion.div
        className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{
          x: [-80, 380],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
      />
    </motion.div>
  );
}

export function CircularProgress({
  progress = 0,
  size = 60,
  strokeWidth = 4,
  variant = "primary",
  className,
  showText = true,
}: {
  progress?: number;
  size?: number;
  strokeWidth?: number;
  variant?: "primary" | "success" | "secondary";
  className?: string;
  showText?: boolean;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      className={cn(
        "relative inline-flex items-center justify-center",
        className
      )}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(
            "transition-all duration-300 ease-out",
            `stroke-${variant}`
          )}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </svg>

      {showText && (
        <motion.span
          className="absolute text-sm font-semibold text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {Math.round(progress)}%
        </motion.span>
      )}
    </motion.div>
  );
}
