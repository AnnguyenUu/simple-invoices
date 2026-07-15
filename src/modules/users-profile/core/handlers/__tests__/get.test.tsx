import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

const fetchUserProfileMock = vi.fn();

vi.mock("../../../repository", () => ({
  fetchUserProfile: () => fetchUserProfileMock(),
}));

const { useGetUserProfile } = await import("../get");

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useGetUserProfile", () => {
  beforeEach(() => {
    fetchUserProfileMock.mockReset();
  });

  it("exposes the fetched profile as userProfile", async () => {
    fetchUserProfileMock.mockResolvedValueOnce({ userId: "u1", fullName: "Jane Doe" });

    const { result } = renderHook(() => useGetUserProfile(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.userProfile).toEqual({
      userId: "u1",
      fullName: "Jane Doe",
    });
  });
});
