import type { NextConfig } from "next";

// Baseline OWASP-recommended security headers. Deliberately not including
// Content-Security-Policy here: next-themes (see providers.tsx) injects an
// inline <script> to set the theme class before hydration and avoid a
// light/dark flash, which a strict script-src would break without adding
// nonce plumbing — that's a separate, more involved change.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Browsers only honor this over an actual HTTPS connection, so it's a
  // no-op in local dev over http://localhost.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
