import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import {
  LocationsApi,
  LocationsApiGetLocationsMeRequest,
} from "myorderapp-square";
import { useSession } from "next-auth/react";

export const GetLocationsMeQueryKey = ["getLocationsMe"];

export const useGetLocationsMeQuery = (
  params: LocationsApiGetLocationsMeRequest
) => {
  const { status } = useSession();
  const sessionedApiConfiguration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: GetLocationsMeQueryKey,
    queryFn: async () => {
      return (
        await new LocationsApi(sessionedApiConfiguration).getLocationsMe(params)
      ).data;
    },
    enabled: status === "authenticated",
  });
};
