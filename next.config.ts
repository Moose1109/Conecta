import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-*",
      },
      {
        protocol: "https",
        hostname: "api-conextapueblos.onrender.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "http",
        hostname: "192.168.1.172",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/pueblos/:path*",
        destination: "/villages/:path*",
      },
      {
        source: "/actividades/:path*",
        destination: "/activities/:path*",
      },
      {
        source: "/comunidad/:path*",
        destination: "/community/:path*",
      },
    ];
  },
};

export default nextConfig;
