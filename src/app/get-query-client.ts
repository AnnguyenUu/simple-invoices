import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

// React.cache() memoizes per server request, not globally — each request
// gets its own QueryClient instead of one shared across users/requests.
// Used by Server Components (e.g. (protected)/layout.tsx) that prefetch a
// query and hand it to the client via <HydrationBoundary>.
export const getQueryClient = cache(() => new QueryClient());
