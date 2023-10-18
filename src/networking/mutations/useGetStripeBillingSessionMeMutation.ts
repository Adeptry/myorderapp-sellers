import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useMutation } from "@tanstack/react-query";
import { MerchantsApi } from "myorderapp-square";

export const useGetStripeBillingSessionMeMutation = () => {
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  return useMutation({
    mutationFn: async (returnUrl: string) => {
      return await new MerchantsApi(
        sessionedApiConfiguration
      ).getStripeBillingSessionMe({ returnUrl });
    },
  });
};
