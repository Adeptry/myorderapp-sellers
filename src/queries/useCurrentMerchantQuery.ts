import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { MerchantsApi } from "moa-merchants-ts-axios";
import { useSession } from "next-auth/react";

export const useCurrentMerchantQuery = (params?: {
  options?: AxiosRequestConfig;
  retry?: boolean;
}) => {
  const { status } = useSession();
  const sessionedApiConfigration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: ["getCurrentMerchant"],
    queryFn: async () => {
      const api = new MerchantsApi(sessionedApiConfigration);
      return (await api.getCurrentMerchant({ user: true, appConfig: true }))
        .data;
    },
    enabled: status === "authenticated",
    retry: params?.retry,
  });
};
