// Server-only map of upstream neobank microservice + version prefixes,
// consumed by src/api/http/neobank-proxy.ts. Deliberately not derived from
// any client-sent value — the upstream path a route hits must stay a
// server-side decision, not something a caller can influence.
export const NEOBANK_SERVICES = {
  membership: "membership-service/1.0.0",
  invoice: "invoice-service/1.0.0",
} as const;
