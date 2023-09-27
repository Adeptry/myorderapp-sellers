import { defaultCurrentCatalogQueryKey } from "@/queries/useCurrentCatalogQuery";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import {
  CatalogsApi,
  CategoriesPatchBody,
  CategoryPaginatedResponse,
} from "myorderapp-square";

export const useUpdateCategoriesMutation = (options?: AxiosRequestConfig) => {
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (categoriesPatchBody: Array<CategoriesPatchBody>) => {
      return (
        await new CatalogsApi(sessionedApiConfiguration).patchCategories({
          categoriesPatchBody,
        })
      ).data;
    },
    onSettled: () => {
      queryClient.invalidateQueries(defaultCurrentCatalogQueryKey);
    },
    onMutate: async (categoriesPatchBody: Array<CategoriesPatchBody>) => {
      const oldResponse = queryClient.getQueryData(
        defaultCurrentCatalogQueryKey
      ) as CategoryPaginatedResponse;

      const newCategories = Array.from(
        (oldResponse.data ?? []).map((category) => ({ ...category }))
      );

      newCategories.forEach((category) => {
        const categoryUpdateAllDto = categoriesPatchBody.find((value) => {
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
