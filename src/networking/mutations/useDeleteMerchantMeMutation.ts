import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useMutation } from "@tanstack/react-query";
import { MerchantsApi } from "myorderapp-square";

export const useDeleteMerchantMeMutation = () => {
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  return useMutation({
    mutationFn: async () => {
      return await new MerchantsApi(
        sessionedApiConfiguration
      ).deleteMerchantMe();
    },
  });
};
