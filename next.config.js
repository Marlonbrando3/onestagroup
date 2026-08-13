/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  productionBrowserSourceMaps: false,
  images: {
    // Zdjęcia ofert z zewnętrznych źródeł omijają Image Optimization,
    // aby hosting nie transferował ich ponownie przez /_next/image.
    formats: ["image/avif", "image/webp"],
    localPatterns: [
      {
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
