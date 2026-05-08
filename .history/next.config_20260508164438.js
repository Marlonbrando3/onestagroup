/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  productionBrowserSourceMaps: false,
  swcMinify: true,
  images: {
    formats: ["image/avif", "image/webp"],
    localPatterns: [
      {
        pathname: "/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "es-metainmo.ams3.cdn.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "fotos15.apinmo.com",
      },
    ],
  },
};

module.exports = nextConfig;
