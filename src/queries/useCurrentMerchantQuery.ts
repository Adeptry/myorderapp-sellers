import { useCookieContext } from "@/contexts/CookieContext";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { MerchantsApi } from "myorderapp-square";
import { useSession } from "next-auth/react";

export const useCurrentMerchantQuery = () => {
  const { status: authStatus, update, data: session } = useSession();
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  const { setColorCookieValue } = useCookieContext();

  return useQuery({
    queryKey: ["getMerchantMe", sessionedApiConfiguration.accessToken],
    queryFn: async () => {
      const api = new MerchantsApi(sessionedApiConfiguration);
      const data = (
        await api.getMerchantMe({ user: true, appConfig: true, catalog: true })
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
