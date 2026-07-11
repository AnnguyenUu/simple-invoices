"use client";

import { context } from "@/context/createContext";
import { useIsMobile } from "@/hooks/useIsMobile";

// Computes isMobile once at the provider (a single matchMedia listener)
// instead of every consumer running its own useIsMobile().
function useDeviceState() {
  return { isMobile: useIsMobile() };
}

// DeviceProvider is mounted once in src/app/providers.tsx; any component
// can then call useDeviceContext().isMobile without its own provider setup.
export const [DeviceProvider, useDeviceContext] = context(
  "Device",
  useDeviceState
);
