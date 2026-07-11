import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../../repository";
import { userQueryKeys } from "../../configuration/constraints";

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
