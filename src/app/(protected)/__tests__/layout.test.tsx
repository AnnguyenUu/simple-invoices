import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const cookieGetMock = vi.fn();
vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({ get: (name: string) => cookieGetMock(name) }),
}));

const redirectMock = vi.fn(() => {
  throw new Error("NEXT_REDIRECT");
});
vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

const prefetchQueryMock = vi.fn().mockResolvedValue(undefined);
vi.mock("@/app/get-query-client", () => ({
  getQueryClient: () => ({ prefetchQuery: prefetchQueryMock }),
}));

vi.mock("@tanstack/react-query", () => ({
  dehydrate: vi.fn(() => ({})),
  HydrationBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

const fetchUserProfileServerMock = vi.fn();
vi.mock("@modules/users-profile/repository/server", () => ({
  fetchUserProfileServer: fetchUserProfileServerMock,
}));

vi.mock("../protected-header", () => ({
  ProtectedHeader: () => <div data-testid="protected-header" />,
}));

const { default: ProtectedLayout } = await import("../layout");

describe("ProtectedLayout", () => {
  beforeEach(() => {
    cookieGetMock.mockReset();
    redirectMock.mockClear();
    prefetchQueryMock.mockClear();
  });

  it("redirects to /login when there is no session cookie", async () => {
    cookieGetMock.mockReturnValue(undefined);

    await expect(
      ProtectedLayout({ children: <div>content</div> })
    ).rejects.toThrow("NEXT_REDIRECT");

    expect(redirectMock).toHaveBeenCalledWith("/login");
    expect(prefetchQueryMock).not.toHaveBeenCalled();
  });

  it("prefetches the user profile and renders children when a session cookie is present", async () => {
    cookieGetMock.mockReturnValue({ value: "session-token" });

    const element = await ProtectedLayout({
      children: <div>protected content</div>,
    });

    expect(redirectMock).not.toHaveBeenCalled();
    expect(prefetchQueryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["user", "me"],
        queryFn: fetchUserProfileServerMock,
      })
    );

    render(element);
    expect(screen.getByTestId("protected-header")).toBeInTheDocument();
    expect(screen.getByText("protected content")).toBeInTheDocument();
  });
});
