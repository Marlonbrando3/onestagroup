/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  productionBrowserSourceMaps: false,
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
      {
        protocol: "https",
        hostname: "www.viviendanet.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
