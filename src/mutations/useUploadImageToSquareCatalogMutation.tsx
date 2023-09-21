import { defaultCurrentCatalogQueryKey } from "@/queries/useCurrentCatalogQuery";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { CatalogsApiFp } from "moa-merchants-ts-axios";

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
      return (
        await CatalogsApiFp(
          sessionedApiConfiguration
        ).postItemSquareImageUpload(
          params.idempotencyKey,
          params.id,
          params.file
        )
      )();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(defaultCurrentCatalogQueryKey);
    },
  });
};
