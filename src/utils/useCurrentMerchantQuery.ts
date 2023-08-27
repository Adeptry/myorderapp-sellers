import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { MerchantsApiFp } from "moa-merchants-ts-axios";

export const useCurrentMerchantQuery = (options?: AxiosRequestConfig) => {
  const { configuration, preloading } = useSessionedApiConfiguration();
  return useQuery({
    queryKey: ["getCurrentMerchant"],
    queryFn: async () => {
      return (
        await (
          await MerchantsApiFp(configuration).getCurrentMerchant(options)
        )()
      ).data;
    },
    enabled: !preloading,
  });
};
