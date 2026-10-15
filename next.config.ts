import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  async redirects() {
    return [
      {
        source: "/okupads",
        destination: "/blog/okupados",
        permanent: true,
      },
      {
        source: "/blog/nieruchomosci-costa-blanca-old",
        destination: "/blog/nieruchomosci-costa-blanca",
        permanent: true,
      },
      // 09.10.2026: artykuł celował wprost w „nieruchomości Hiszpania” i konkurował
      // z katalogiem, który omawia te same tematy pełniej — scalamy sygnały.
      {
        source: "/blog/nieruchomosci-w-hiszpanii",
        destination: "/nieruchomosci/hiszpania",
        permanent: true,
      },
      // Wpis blogowy kanibalizował frazę „polskie biuro nieruchomości w Hiszpanii”;
      // poradnik żyje teraz pod /blog/jak-wybrac-biuro-nieruchomosci-w-hiszpanii.
      {
        source: "/blog/polskie-biuro-nieruchomosci-w-hiszpanii",
        destination: "/polskie-biuro-nieruchomosci-w-hiszpanii",
        permanent: true,
      },
      // Skrócona „pigułka” duplikowała pełny poradnik procesu zakupu.
      {
        source: "/blog/jak-kupic-nieruchomosc-w-hiszpanii-pigulka",
        destination: "/blog/nieruchomosci-w-hiszpanii-jak-wyglada-proces",
        permanent: true,
      },
      {
        source: "/nieruchomosci/hiszpania/wszystkie-regiony",
        destination: "/nieruchomosci/hiszpania",
        permanent: true,
      },
    ];
  },
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
      // Zdjęcia z feedów idą przez Netlify Image CDN prosto ze źródła (bez funkcji).
      // Next pozwala tu na max 50 wzorców, a hostów jest ~90, więc produkcyjna
      // lista jest w netlify.toml ([images] remote_images, ta sama co w
      // lib/propertyImageSources.ts). Next sprawdza hosty tylko w trybie dev.
      ...(process.env.NODE_ENV === "development"
        ? [{ protocol: "https" as const, hostname: "**" }]
        : []),
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
