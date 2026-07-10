// Server-only map of upstream neobank microservice + version prefixes,
// consumed by src/api/http/neobank-proxy.ts. Deliberately not derived from
// any client-sent value — see the discussion on src/app/api/users/me/route.ts
// for why the upstream service/path must stay a server-side decision.
export const NEOBANK_SERVICES = {
  membership: "membership-service/1.0.0",
  invoice: "invoice-service/1.0.0",
} as const;
