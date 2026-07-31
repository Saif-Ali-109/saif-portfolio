import type { NextConfig } from "next";

const allowedDevOriginsEnv = process.env.NEXT_PUBLIC_ALLOWED_DEV_ORIGINS;
const allowedDevOrigins = allowedDevOriginsEnv
  ? allowedDevOriginsEnv.split(",").map(s => s.trim()).filter(Boolean)
  : ["192.168.0.125", "192.168.0.*"];

const isProd = process.env.NODE_ENV === "production";

// CSP follows Next.js's documented "Without Nonces" pattern
// (node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md).
// Strict nonce-based CSP would require dynamic rendering (SSR per request,
// no static/CDN caching) — not worth it for a static portfolio.
// 'unsafe-inline' in script-src is REQUIRED: Next.js streams inline
// self.__next_f flight scripts that cannot be hashed/nonced in static mode.
// XSS defense therefore rests on the sanitizer in Chatbot.tsx (escapeHtml +
// safeUrl), which is tested against attribute-breakout payloads.
const scriptSrc = "'self' 'unsafe-inline'";

const connectSrc = [
  "'self'",
  process.env.NEXT_PUBLIC_AI_API_URL || "",
  isProd ? "" : "ws:",
].filter(Boolean).join(" ");

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  `connect-src ${connectSrc}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

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
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
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
