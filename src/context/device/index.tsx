"use client";

import { context } from "@/context/createContext";
import { useIsMobile } from "@/hooks/useIsMobile";

function useDeviceState() {
  return { isMobile: useIsMobile() };
}

export const [DeviceProvider, useDeviceContext] = context(
  "Device",
  useDeviceState
);
