"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/libs/ui/ErrorBoundary";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return <ErrorFallback error={error} reset={reset} />;
}
