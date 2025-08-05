// components/ProductGrid.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ProductNotFound } from "@/components/product-notfound";

type Product = {
  image?: string;
  title: string;
  price: string;
  rating?: number;
  reviews?: number | string;
  link: string;
};

type ProductGridProps = {
  products: Product[];
  platform: "amazon" | "flipkart" | string;
};

const ProductGrid = ({ products, platform }: ProductGridProps) => {
  return (
    <motion.div
      className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-6 px-1 sm:px-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 2 }}
      transition={{ duration: 0.5 }}
    >
      {products.length > 0 ? (
        products.map((item, index) => (
          <motion.div
            key={`${platform}-${index}`}
            className="flex flex-col gap-2 sm:gap-3 p-3 sm:p-4 shadow-2xl rounded-lg hover:shadow-lg transition-all duration-200 var(--sidebar-accent) dark:bg-gray-800"
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -2 }}
          >
            <div className="relative aspect-square w-full">
              <Image
                fill
                src={item.image || "/placeholder-product.png"}
                alt={item.title || "Product Image"}
                className="object-contain rounded"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/placeholder-product.png";
                }}
              />
            </div>
            <div className="flex-1 flex flex-col">
              <h3 className="flex flex-col text-xs sm:text-sm font-semibold line-clamp-2 mb-1 sm:mb-2 min-h-[2.5rem] sm:min-h-[3rem]">
                {item.title}
              </h3>
              <p className="text-sm sm:text-lg font-bold text-green-600 mb-1">
                {item.price}
              </p>
              {item.rating && (
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-yellow-500 text-xs sm:text-sm">⭐</span>
                  <span className="text-xs sm:text-sm text-foreground/70">
                    {item.rating}
                  </span>
                  {item.reviews && (
                    <span className="text-xs text-foreground/50 truncate">
                      ({item.reviews})
                    </span>
                  )}
                </div>
              )}
              <a
                href={
                  platform === "flipkart"
                    ? `https://flipkart.com${item.link}`
                    : platform === "amazon"
                    ? `https://amazon.in${item.link}`
                    : item.link
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline text-xs sm:text-sm mt-auto inline-block py-1"
              >
                View Product
              </a>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="col-span-full">
          <ProductNotFound platform={platform} />
        </div>
      )}
    </motion.div>
  );
};

export default ProductGrid;
