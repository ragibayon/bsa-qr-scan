import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/scan",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
