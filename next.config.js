/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  productionBrowserSourceMaps: false,
  async rewrites() {
    return [
      {
        source: "/crm",
        destination: "/CRM",
      },
      {
        source: "/crm/dodaj-kontakt",
        destination: "/CRM/dodaj-kontakt",
      },
      {
        source: "/crm/lejek",
        destination: "/CRM/lejek",
      },
      {
        source: "/crm/kontakt/:id",
        destination: "/CRM/kontakt/:id",
      },
    ];
  },
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
