import { GetCategoriesQueryKey } from "@/networking/queries/useGetCategoriesMeQuery";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CatalogsApi,
  CategoriesPatchBody,
  CategoryPaginatedResponse,
} from "myorderapp-square";

export const usePatchCategoriesMutation = () => {
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
      queryClient.invalidateQueries(GetCategoriesQueryKey);
    },
    onMutate: async (categoriesPatchBody: Array<CategoriesPatchBody>) => {
      const oldResponse = queryClient.getQueryData(
        GetCategoriesQueryKey
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

      queryClient.setQueryData(GetCategoriesQueryKey, {
        data: newCategories,
      });

      return () => queryClient.setQueryData(GetCategoriesQueryKey, oldResponse);
    },
  });
};
