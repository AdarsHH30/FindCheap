import * as React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-1 sm:gap-2 p-2 sm:p-3 shadow-lg rounded-lg bg-card border">
      <Skeleton className="w-full aspect-square rounded" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-2/5" />
    </div>
  );
}
