import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MerchantsApi } from "myorderapp-square";
import { GetCategoriesQueryKey } from "../queries/useGetCategoriesMeQuery";

export const useGetSquareSyncMeMutation = () => {
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return await new MerchantsApi(
        sessionedApiConfiguration
      ).getSquareSyncMe();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: GetCategoriesQueryKey });
    },
  });
};
