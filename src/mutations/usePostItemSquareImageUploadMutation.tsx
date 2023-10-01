import { GetCategoriesQueryKey } from "@/queries/useGetCategoriesMeQuery";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CatalogsApi } from "myorderapp-square";

export const usePostItemSquareImageUploadMutation = () => {
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      idempotencyKey: string;
      id: string;
      file?: File;
    }) => {
      return await new CatalogsApi(
        sessionedApiConfiguration
      ).postItemSquareImageUpload({ ...params });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(GetCategoriesQueryKey);
    },
  });
};
