"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Button, Callout, Flex } from "@radix-ui/themes";

export function ErrorFallback({
  error,
  reset,
}: {
  error?: Error;
  reset: () => void;
}) {
  return (
    <Flex direction="column" align="center" justify="center" gap="3" py="8">
      <Callout.Root color="red" size="2">
        <Callout.Icon>
          <ExclamationTriangleIcon />
        </Callout.Icon>
        <Callout.Text>
          {error?.message || "Something went wrong. Please try again."}
        </Callout.Text>
      </Callout.Root>
      <Button variant="soft" color="red" onClick={reset}>
        Try again
      </Button>
    </Flex>
  );
}

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) {
      return this.props.children;
    }

    return this.props.fallback
      ? this.props.fallback(error, this.reset)
      : <ErrorFallback error={error} reset={this.reset} />;
  }
}
