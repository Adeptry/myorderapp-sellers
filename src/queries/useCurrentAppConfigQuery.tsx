import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { AppConfigsApiFp } from "moa-merchants-ts-axios";
import { useSession } from "next-auth/react";

export const useCurrentConfigQuery = (params?: {
  options?: AxiosRequestConfig;
  retry?: boolean;
}) => {
  const { status } = useSession();
  const sessionedApiConfigration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: ["getMyConfig"],
    queryFn: async () => {
      return (
        await (
          await AppConfigsApiFp(sessionedApiConfigration).getMeAppConfig(
            undefined,
            "merchant",
            params?.options
          )
        )()
      ).data;
    },
    enabled: status === "authenticated",
    retry: params?.retry,
  });
};
