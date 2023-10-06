import { useCookieContext } from "@/components/providers/CookieContext";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { MerchantsApi } from "myorderapp-square";
import { useSession } from "next-auth/react";

export const GetMerchantsMeQueryKey = "getMerchantMe";

export const useGetMerchantMeQuery = () => {
  const {
    status: authStatus,
    update: updateAuth,
    data: session,
  } = useSession();
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  const { setColorCookieValue } = useCookieContext();

  return useQuery({
    queryKey: [GetMerchantsMeQueryKey, sessionedApiConfiguration.accessToken],
    queryFn: async () => {
      const data = (
        await new MerchantsApi(sessionedApiConfiguration).getMerchantMe({
          user: true,
          appConfig: true,
          catalog: true,
        })
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
        updateAuth();
        return failureCount < 3;
      }
      return false;
    },
  });
};
