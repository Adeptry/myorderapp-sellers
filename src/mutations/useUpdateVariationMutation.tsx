import { defaultCurrentCatalogQueryKey } from "@/queries/useCurrentCatalogQuery";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import {
  CatalogsApiFp,
  CategoryPaginatedResponse,
  VariationUpdateDto,
} from "moa-merchants-ts-axios";

export const useUpdateVariationMutation = (options?: AxiosRequestConfig) => {
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      variationUpdateDto: VariationUpdateDto;
    }) => {
      return (
        await CatalogsApiFp(sessionedApiConfiguration).updateVariation(
          params.id,
          params.variationUpdateDto,
          options
        )
      )();
    },
    onMutate: async ({ id, variationUpdateDto }) => {
      const oldData = queryClient.getQueryData<CategoryPaginatedResponse>(
        defaultCurrentCatalogQueryKey
      );

      if (oldData) {
        const newData = JSON.parse(JSON.stringify(oldData));

        for (const category of newData.data ?? []) {
          for (const item of category.items ?? []) {
            for (const variation of item.variations ?? []) {
              if (variation.id === id) {
                Object.assign(variation, variationUpdateDto);
                break;
              }
            }
          }
        }

        queryClient.setQueryData(defaultCurrentCatalogQueryKey, newData);

        return () => {
          queryClient.setQueryData(defaultCurrentCatalogQueryKey, oldData);
        };
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries(defaultCurrentCatalogQueryKey);
    },
  });
};
