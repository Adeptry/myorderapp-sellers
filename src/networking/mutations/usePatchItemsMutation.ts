import { GetCategoriesQueryKey } from "@/networking/queries/useGetCategoriesMeQuery";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CatalogsApi,
  CategoryPaginatedResponse,
  ItemsPatchBody,
} from "myorderapp-square";

export const usePatchItemsMutation = () => {
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemsPatchBody: Array<ItemsPatchBody>) => {
      return (
        await new CatalogsApi(sessionedApiConfiguration).patchItems({
          itemsPatchBody,
        })
      ).data;
    },
    onMutate: async (itemsPatchBody: Array<ItemsPatchBody>) => {
      const oldResponse = queryClient.getQueryData(
        GetCategoriesQueryKey
      ) as CategoryPaginatedResponse;

      const newCategories = Array.from(
        (oldResponse.data ?? []).map((category) => ({
          ...category,
          items: category.items ? [...category.items] : [],
        }))
      );

      newCategories.forEach((category) => {
        category.items?.forEach((item) => {
          const itemUpdateDto = itemsPatchBody.find(
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

      queryClient.setQueryData(GetCategoriesQueryKey, {
        data: newCategories,
      });

      return () => queryClient.setQueryData(GetCategoriesQueryKey, oldResponse);
    },
    onSettled: () => {
      queryClient.invalidateQueries(GetCategoriesQueryKey);
    },
  });
};
