import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin requests during development (HMR & dev resources for local IP/network testing)
  allowedDevOrigins: [
    "192.168.56.1",
    "[IP_ADDRESS]"
  ],
  // Configure CORS headers for all frontend routes and API requests
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ],
      },
    ];
  },
};

export default nextConfig;
