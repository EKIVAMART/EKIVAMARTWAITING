import type { NextConfig } from "next";

const waitlistApiUrl = (
  process.env.WAITLIST_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://faflora-production.onrender.com"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return ["launch-config", "join"].map((endpoint) => ({
      source: `/api/v1/waitlist/${endpoint}`,
      destination: `${waitlistApiUrl}/api/v1/waitlist/${endpoint}`,
    }));
  },
};

export default nextConfig;
