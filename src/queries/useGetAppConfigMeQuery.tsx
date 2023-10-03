import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import {
  AppConfigsApi,
  AppConfigsApiGetAppConfigMeRequest,
} from "myorderapp-square";
import { useSession } from "next-auth/react";

export const getAppConfigMeQueryKeyBuilder = (
  params: AppConfigsApiGetAppConfigMeRequest
) => {
  return ["getAppConfigMe", params];
};

export const useGetAppConfigMeQuery = (
  params: AppConfigsApiGetAppConfigMeRequest
) => {
  const { status } = useSession();
  const sessionedApiConfigration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: getAppConfigMeQueryKeyBuilder(params),
    queryFn: async () => {
      return (
        await new AppConfigsApi(sessionedApiConfigration).getAppConfigMe(params)
      ).data;
    },
    enabled: status === "authenticated",
  });
};
