import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import {
  MerchantsApi,
  MerchantsApiGetCurrentMerchantRequest,
} from "moa-merchants-ts-axios";
import { useSession } from "next-auth/react";

export const useCurrentMerchantQuery = (params?: {
  params?: MerchantsApiGetCurrentMerchantRequest;
  options?: AxiosRequestConfig;
  retry?: boolean;
}) => {
  const { status } = useSession();
  const sessionedApiConfigration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: ["getCurrentMerchant", params],
    queryFn: async () => {
      const api = new MerchantsApi(sessionedApiConfigration);
      return (await api.getCurrentMerchant(params?.params ?? {})).data;
    },
    enabled: status === "authenticated",
    retry: params?.retry,
  });
};
