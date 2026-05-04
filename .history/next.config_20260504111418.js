/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  productionBrowserSourceMaps: false,
  swcMinify: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "es-metainmo.ams3.cdn.digitaloceanspaces.com",
      },
    ],
  },
};

module.exports = nextConfig;
