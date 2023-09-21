import { defaultCurrentCatalogQueryKey } from "@/queries/useCurrentCatalogQuery";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import {
  CatalogsApiFp,
  CategoryPaginatedResponse,
  CategoryUpdateAllDto,
} from "moa-merchants-ts-axios";

export const useUpdateCategoriesMutation = (options?: AxiosRequestConfig) => {
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (categoryUpdateAllDto: Array<CategoryUpdateAllDto>) => {
      return (
        await (
          await CatalogsApiFp(sessionedApiConfiguration).patchCategories(
            categoryUpdateAllDto
          )
        )()
      ).data;
    },
    onSettled: () => {
      queryClient.invalidateQueries(defaultCurrentCatalogQueryKey);
    },
    onMutate: async (categoryUpdateAllDtos: Array<CategoryUpdateAllDto>) => {
      const oldResponse = queryClient.getQueryData(
        defaultCurrentCatalogQueryKey
      ) as CategoryPaginatedResponse;

      const newCategories = Array.from(
        (oldResponse.data ?? []).map((category) => ({ ...category }))
      );

      newCategories.forEach((category) => {
        const categoryUpdateAllDto = categoryUpdateAllDtos.find((value) => {
          return value.id === category.id;
        });
        if (categoryUpdateAllDto) {
          if (categoryUpdateAllDto.moaOrdinal !== undefined) {
            category.moaOrdinal = categoryUpdateAllDto.moaOrdinal;
          }

          if (categoryUpdateAllDto.moaEnabled !== undefined) {
            category.moaEnabled = categoryUpdateAllDto.moaEnabled;
          }
        }
      });
      newCategories.sort((a, b) => (a.moaOrdinal ?? 0) - (b.moaOrdinal ?? 0));

      queryClient.setQueryData(defaultCurrentCatalogQueryKey, {
        data: newCategories,
      });

      return () =>
        queryClient.setQueryData(defaultCurrentCatalogQueryKey, oldResponse);
    },
  });
};
