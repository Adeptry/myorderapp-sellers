import { getAppConfigMeQueryKeyBuilder } from "@/networking/queries/useGetAppConfigMeQuery";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AppConfigsApi,
  AppConfigsApiGetAppConfigMeRequest,
  AppConfigsApiPatchAppConfigMeRequest,
} from "myorderapp-square";

export const usePatchAppConfigMeMutation = (
  queryParams: AppConfigsApiGetAppConfigMeRequest
) => {
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: AppConfigsApiPatchAppConfigMeRequest) => {
      return await new AppConfigsApi(
        sessionedApiConfiguration
      ).patchAppConfigMe(params);
    },
    onSettled: () => {
      queryClient.invalidateQueries(getAppConfigMeQueryKeyBuilder(queryParams));
    },
  });
};
