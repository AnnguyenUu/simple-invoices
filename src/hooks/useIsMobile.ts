import { useEffect, useState } from "react";

// Matches Radix Themes' `sm` breakpoint (breakpoints.css) — the same point
// protected-header.tsx collapses its nav at.
const MOBILE_BREAKPOINT = 768;

// Starts `false` on every render (server and the first client render) to
// avoid a hydration mismatch, then corrects after mount — same
// match-server-then-correct pattern as providers.tsx's RadixThemeSync
// theme gate. Reading window.innerWidth directly in the initializer would
// make the client's first render diverge from the server's.
export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const update = () => setIsMobile(mediaQuery.matches);
    update();

    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}
