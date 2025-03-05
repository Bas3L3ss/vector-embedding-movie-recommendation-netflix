import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "picsum.photos",
        port: "",
        protocol: "https",
      },
      {
        hostname: "ucnyynmrpcridchyakug.supabase.co",
        port: "",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
