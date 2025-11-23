import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Add all quality levels we're using
    qualities: [70, 75, 85, 90],
    // Optional: specify which domains images can be loaded from
    remotePatterns: [],
  },
};

export default nextConfig;