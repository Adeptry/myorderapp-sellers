import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { AppConfigsApi } from "moa-merchants-ts-axios";
import { useSession } from "next-auth/react";

export const useCurrentConfigQuery = (params?: {
  options?: AxiosRequestConfig;
  retry?: boolean;
}) => {
  const { status } = useSession();
  const sessionedApiConfigration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: ["getAppConfigMe"],
    queryFn: async () => {
      const api = new AppConfigsApi(sessionedApiConfigration);
      return (
        await api.getAppConfigMe(
          {
            actingAs: "merchant",
          },
          params?.options
        )
      ).data;
    },
    enabled: status === "authenticated",
    retry: params?.retry,
  });
};
