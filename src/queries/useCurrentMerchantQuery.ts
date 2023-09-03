import { useCookieContext } from "@/contexts/CookieContext";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { MerchantsApi } from "moa-merchants-ts-axios";
import { useSession } from "next-auth/react";

export const currentMerchantQueryKey = ["getCurrentMerchant"];
export const useCurrentMerchantQuery = (params?: {
  options?: AxiosRequestConfig;
  retry?: boolean;
}) => {
  const { status } = useSession();
  const sessionedApiConfigration = useSessionedApiConfiguration();
  const { setColorCookieValue } = useCookieContext();

  return useQuery({
    queryKey: currentMerchantQueryKey,
    queryFn: async () => {
      const api = new MerchantsApi(sessionedApiConfigration);
      const data = (
        await api.getCurrentMerchant({ user: true, appConfig: true })
      ).data;
      const seedColor = data.appConfig?.seedColor;
      if (seedColor) {
        setColorCookieValue(seedColor);
      }
      return data;
    },
    enabled: status === "authenticated",
    retry: params?.retry,
  });
};
