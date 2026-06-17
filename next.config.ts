import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
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
};

export default nextConfig;
