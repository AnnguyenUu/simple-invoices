"use client";

import { Theme } from "@radix-ui/themes";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useEffect, useState, type ReactNode } from "react";
import { DeviceProvider } from "@/context/device";
import { ErrorBoundary } from "@/libs/ui/ErrorBoundary";

function useQueryClientSingleton() {
  const [queryClient] = useState(() => new QueryClient());
  return queryClient;
}

function RadixThemeSync({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Theme appearance={mounted && resolvedTheme === "dark" ? "dark" : "light"}>
      {children}
    </Theme>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = useQueryClientSingleton();

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <RadixThemeSync>
          <DeviceProvider>
            <ErrorBoundary>{children}</ErrorBoundary>
          </DeviceProvider>
        </RadixThemeSync>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
