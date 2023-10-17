import { GetLocationsMeQueryKey } from "@/networking/queries/useGetLocationsMeQuery";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LocationsApi,
  LocationsApiPatchOneLocationRequest,
} from "myorderapp-square";

export const usePatchLocationMutation = () => {
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: LocationsApiPatchOneLocationRequest) => {
      return await new LocationsApi(sessionedApiConfiguration).patchOneLocation(
        params
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: GetLocationsMeQueryKey });
    },
  });
};
