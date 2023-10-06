import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  LocationsApi,
  LocationsApiGetLocationsMeRequest,
} from "myorderapp-square";
import { useSession } from "next-auth/react";

export const GetLocationsMeQueryKey = ["getLocationsMe"];

export const useGetLocationsMeQuery = (
  params: LocationsApiGetLocationsMeRequest
) => {
  const {
    status: authStatus,
    update: updateAuth,
    data: session,
  } = useSession();
  const sessionedApiConfiguration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: GetLocationsMeQueryKey,
    queryFn: async () => {
      return (
        await new LocationsApi(sessionedApiConfiguration).getLocationsMe(params)
      ).data;
    },
    enabled: authStatus === "authenticated",
    retry: (failureCount, error: AxiosError) => {
      if (error?.response?.status === 401 && session !== null) {
        updateAuth();
        return failureCount < 3;
      }
      return false;
    },
  });
};
