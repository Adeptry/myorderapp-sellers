import { defaultCurrentCatalogQueryKey } from "@/queries/useCurrentCatalogQuery";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { CatalogsApi } from "myorderapp-square";

export const useUploadImageToSquareCatalogMutation = (
  options?: AxiosRequestConfig
) => {
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
      queryClient.invalidateQueries(defaultCurrentCatalogQueryKey);
    },
  });
};
