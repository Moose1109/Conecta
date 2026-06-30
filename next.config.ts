import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
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
