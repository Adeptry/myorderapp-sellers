import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { MerchantsApiFp } from "moa-merchants-ts-axios";
import { useSession } from "next-auth/react";

export const useCurrentMerchantQuery = (options?: AxiosRequestConfig) => {
  const { status } = useSession();
  const sessionedApiConfigration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: ["getCurrentMerchant"],
    queryFn: async () => {
      return (
        await (
          await MerchantsApiFp(sessionedApiConfigration).getCurrentMerchant(
            options
          )
        )()
      ).data;
    },
    enabled: status === "authenticated",
  });
};
