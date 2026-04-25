import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse'],
  async redirects() {
    return [
      {
        source: '/ats-scanner',
        destination: '/analyzer',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
