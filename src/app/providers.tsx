"use client";

import { Theme } from "@radix-ui/themes";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useEffect, useState, type ReactNode } from "react";

// One QueryClient per browser tab/session, not per render — useState's
// initializer runs once on mount and is stable across re-renders.
function useQueryClientSingleton() {
  const [queryClient] = useState(() => new QueryClient());
  return queryClient;
}

function RadixThemeSync({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  // Match the server-rendered ("light") appearance on the very first client
  // render so hydration sees identical markup, then flip to the resolved
  // theme in a normal post-hydration re-render. React intentionally leaves
  // a className mismatch discovered *during* hydration unpatched, so doing
  // this directly from useTheme() would silently get stuck on "light".
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
        <RadixThemeSync>{children}</RadixThemeSync>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
