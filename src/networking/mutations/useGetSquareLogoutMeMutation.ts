import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MerchantsApi } from "myorderapp-square";
import { GetMerchantsMeQueryKey } from "../queries/useGetMerchantMeQuery";

export const useGetSquareLogoutMeMutation = () => {
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return await new MerchantsApi(
        sessionedApiConfiguration
      ).getMeSquareLogout();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [GetMerchantsMeQueryKey] });
    },
  });
};
