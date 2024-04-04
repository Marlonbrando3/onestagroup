/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.asariweb.pl",
        port: "",
        pathname: "*/**",
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
