import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BadgePercent, LineChart, Loader2, Search, Store } from "lucide-react";

const ProductPlaceholder: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingDots, setLoadingDots] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    const dotsInterval = setInterval(() => {
      setLoadingDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 300);

    return () => {
      clearTimeout(timer);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center flex-1 text-center min-h-[720px] overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-background via-background/95 to-background/80 p-6 shadow-inner">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-[-15%] h-72 w-72 rounded-full bg-emerald-400/10 blur-[120px]" />

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-10"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary shadow-lg backdrop-blur">
              <Loader2 className="h-8 w-8 animate-spin" aria-hidden="true" />
              <span className="absolute -bottom-4 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground shadow-md">
                Crunching data{loadingDots}
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold">
                Working on your best deals
              </h3>
              <p className="text-muted-foreground text-sm">
                Sit tight while we gather live offers and compare prices across
                the web.
              </p>
            </div>
          </div>

          <div className="grid w-full gap-4 text-left md:grid-cols-3">
            {[
              {
                icon: Store,
                title: "Scanning retailers",
                description:
                  "Checking Amazon, Flipkart, Myntra and more for fresh listings.",
              },
              {
                icon: BadgePercent,
                title: "Applying coupons",
                description:
                  "Looking for bank offers and hidden discounts you can stack.",
              },
              {
                icon: LineChart,
                title: "Tracking history",
                description:
                  "Comparing current prices with recent trends to highlight the lowest drop.",
              },
            ].map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="rounded-2xl border border-border/60 bg-background/80 p-5 shadow-sm backdrop-blur-lg"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h4 className="text-base font-semibold text-foreground">
                  {title}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-8"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary shadow-inner">
            <Search className="h-8 w-8" aria-hidden="true" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold leading-tight text-foreground">
              Start by searching for a product
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Enter a product name above and we&apos;ll surface the top deals
              across trusted stores—complete with coupons, price history, and
              watchlist tracking.
            </p>
          </div>
          <div className="grid w-full gap-4 text-sm text-muted-foreground sm:grid-cols-3">
            {[
              "Compare prices instantly",
              "Save recent searches automatically",
              "Get alerts when prices drop",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-dashed border-border/70 bg-background/70 px-4 py-3"
              >
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProductPlaceholder;
