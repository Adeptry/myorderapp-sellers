import { defaultCurrentCatalogQueryKey } from "@/queries/useCurrentCatalogQuery";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import {
  CatalogsApi,
  CategoryPaginatedResponse,
  ItemUpdateAllDto,
} from "moa-merchants-ts-axios";

export const useUpdateItemsMutation = (options?: AxiosRequestConfig) => {
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemUpdateAllDto: Array<ItemUpdateAllDto>) => {
      return (
        await new CatalogsApi(sessionedApiConfiguration).patchItems(
          { itemUpdateAllDto },
          options
        )
      ).data;
    },
    onMutate: async (itemUpdateAllDtos: Array<ItemUpdateAllDto>) => {
      const oldResponse = queryClient.getQueryData(
        defaultCurrentCatalogQueryKey
      ) as CategoryPaginatedResponse;

      const newCategories = Array.from(
        (oldResponse.data ?? []).map((category) => ({
          ...category,
          items: category.items ? [...category.items] : [],
        }))
      );

      newCategories.forEach((category) => {
        category.items?.forEach((item) => {
          const itemUpdateDto = itemUpdateAllDtos.find(
            (dto) => dto.id === item.id
          );
          if (itemUpdateDto) {
            if (itemUpdateDto.moaOrdinal !== undefined) {
              item.moaOrdinal = itemUpdateDto.moaOrdinal;
            }
            if (itemUpdateDto.moaEnabled !== undefined) {
              item.moaEnabled = itemUpdateDto.moaEnabled;
            }
          }
        });
        category.items?.sort(
          (a, b) => (a.moaOrdinal ?? 0) - (b.moaOrdinal ?? 0)
        );
      });

      queryClient.setQueryData(defaultCurrentCatalogQueryKey, {
        data: newCategories,
      });

      return () =>
        queryClient.setQueryData(defaultCurrentCatalogQueryKey, oldResponse);
    },
    onSettled: () => {
      queryClient.invalidateQueries(defaultCurrentCatalogQueryKey);
    },
  });
};
