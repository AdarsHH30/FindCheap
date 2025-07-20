import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "cdn.pixabay.com",
      "rukminim2.flixcart.com",
      "m.media-amazon.com",
      "images.unsplash.com",
      "cdn.shopify.com",
      "i.imgur.com",
      "g.sdlcdn.com",
      "cdn.shopify.com",
      "www.jiomart.com",
      "www.meesho.com",
      "images.meesho.com"
    ],
        remotePatterns: [new URL('https://assets.example.com/account123/**')],

  },
};

export default nextConfig;
