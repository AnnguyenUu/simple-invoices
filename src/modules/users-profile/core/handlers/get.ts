import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../../repository";
import { userQueryKeys } from "../../configuration/constraints";

// staleTime: Infinity — the profile is prefetched server-side once per
// page load ((protected)/layout.tsx) and doesn't change during a session,
// so this hook only ever reads that hydrated cache entry; it never issues
// its own client-side fetch in normal use.
export function useGetUserProfile() {
  const query = useQuery({
    queryKey: userQueryKeys.me,
    queryFn: fetchUserProfile,
    staleTime: Infinity
  });
  return {
    ...query,
    userProfile: query?.data
  }
}
