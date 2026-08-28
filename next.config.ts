import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  images: {
    localPatterns: [
      // The proxy accepts a dynamic, validated `url` query parameter.
      { pathname: "/api/property-image" },
      // Static files must not carry arbitrary query parameters.
      { pathname: "/**", search: "" },
    ],
    // Property cards use the allow-listed local /api/property-image proxy so
    // every feed can use Vercel Image Optimization without opening the public
    // optimizer to arbitrary hosts. These patterns cover editorial content.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75],
    minimumCacheTTL: 86_400,
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 320, 384],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
