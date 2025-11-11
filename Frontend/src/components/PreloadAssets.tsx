"use client";

import { useEffect } from "react";

const CACHE_NAME = "findcheap-static-assets-v1";

const assetsToPreload = [
  { url: "/demo.mp4", type: "video" as const },
  { url: "/find-prod.png", type: "image" as const },
  { url: "/models/earbuds.glb", type: "model" as const },
];

export default function PreloadAssets() {
  useEffect(() => {
    const preload = async () => {
      if (typeof window === "undefined") return;

      const urls = assetsToPreload.map((asset) => asset.url);

      if ("caches" in window) {
        try {
          const cache = await caches.open(CACHE_NAME);
          await Promise.all(
            urls.map(async (url) => {
              const match = await cache.match(url);
              if (!match) {
                await cache.add(url);
              }
            })
          );
        } catch (error) {
          console.warn("Failed to warm cache", error);
        }
      }

      await Promise.all(
        assetsToPreload.map(async (asset) => {
          if (asset.type === "image") {
            return new Promise<void>((resolve, reject) => {
              const img = new Image();
              img.onload = () => resolve();
              img.onerror = () =>
                reject(new Error(`Failed to preload ${asset.url}`));
              img.src = asset.url;
            });
          }

          try {
            await fetch(asset.url, {
              cache: "force-cache",
            });
          } catch (error) {
            console.warn(`Failed to preload ${asset.url}`, error);
          }
        })
      );
    };

    preload();
  }, []);

  return null;
}
