import { useCookieContext } from "@/contexts/CookieContext";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosRequestConfig } from "axios";
import { MerchantsApi } from "moa-merchants-ts-axios";
import { useSession } from "next-auth/react";

export const useCurrentMerchantQuery = (params?: {
  options?: AxiosRequestConfig;
}) => {
  const queryClient = useQueryClient();
  const { status: authStatus, update, data: session } = useSession();
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  const { setColorCookieValue } = useCookieContext();

  return useQuery({
    queryKey: ["getCurrentMerchant", sessionedApiConfiguration.accessToken],
    queryFn: async () => {
      const api = new MerchantsApi(sessionedApiConfiguration);
      const data = (
        await api.getCurrentMerchant(
          { user: true, appConfig: true },
          params?.options
        )
      ).data;
      const seedColor = data.appConfig?.seedColor;
      if (seedColor) {
        setColorCookieValue(seedColor);
      }
      return data;
    },
    enabled: authStatus !== "loading",
    retry: (failureCount, error: AxiosError) => {
      if (error?.response?.status === 401 && session !== null) {
        update();
        return failureCount < 3;
      }
      return false;
    },
  });
};
