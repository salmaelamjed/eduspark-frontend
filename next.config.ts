import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: process.env.NEXT_PUBLIC_API_URL?.startsWith("https")
          ? "https"
          : "http",
        hostname: new URL(
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
        ).hostname,
        port: new URL(
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
        ).port,
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "eduspark-7x40dl5m.b4a.run",
        pathname: "/storage/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/proxy/storage/:path*",
        destination: "http://localhost:8000/storage/:path*",
      },
    ];
  },
};

export default nextConfig;
