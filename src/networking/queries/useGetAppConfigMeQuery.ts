import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
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

export const useGetAppConfigMeQuery = () => {
  const { status, update, data: session } = useSession();
  const sessionedApiConfigration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: getAppConfigMeQueryKeyBuilder({ actingAs: "merchant" }),
    queryFn: async () => {
      return (
        await new AppConfigsApi(sessionedApiConfigration).getAppConfigMe({
          actingAs: "merchant",
        })
      ).data;
    },
    enabled: status === "authenticated",
    retry: (failureCount, error: AxiosError) => {
      if (error?.response?.status === 401 && session !== null) {
        update();
        return failureCount < 3;
      }
      return false;
    },
  });
};
