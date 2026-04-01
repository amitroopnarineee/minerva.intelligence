import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/analytics", destination: "/command-center", permanent: false },
      { source: "/integrations", destination: "/", permanent: false },
      { source: "/bulk-enrich", destination: "/", permanent: false },
      { source: "/get-started", destination: "/", permanent: false },
      { source: "/usage", destination: "/", permanent: false },
      { source: "/home", destination: "/", permanent: false },
    ]
  },
};

export default nextConfig;
