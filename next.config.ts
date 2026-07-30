import type { NextConfig } from "next";

const allowedDevOriginsEnv = process.env.NEXT_PUBLIC_ALLOWED_DEV_ORIGINS;
const allowedDevOrigins = allowedDevOriginsEnv
  ? allowedDevOriginsEnv.split(",").map(s => s.trim()).filter(Boolean)
  : ["192.168.0.125", "192.168.0.*"];

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins,
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
