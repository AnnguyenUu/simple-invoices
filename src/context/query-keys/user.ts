// Centralized React Query key for the current user's profile — shared by
// the SSR prefetch in (protected)/layout.tsx and the client-side
// useGetUserProfile() hook so they hit the same cache entry.
export const userQueryKeys = {
  me: ["user", "me"] as const,
};
