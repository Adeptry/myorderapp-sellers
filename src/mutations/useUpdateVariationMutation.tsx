import { GetCategoriesQueryKey } from "@/queries/useGetCategoriesMeQuery";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CatalogsApi,
  CategoryPaginatedResponse,
  VariationPatchBody,
} from "myorderapp-square";

export const useUpdateVariationMutation = () => {
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      variationPatchBody: VariationPatchBody;
    }) => {
      return await new CatalogsApi(sessionedApiConfiguration).updateVariation({
        ...params,
      });
    },
    onMutate: async ({ id, variationPatchBody }) => {
      const oldData = queryClient.getQueryData<CategoryPaginatedResponse>(
        GetCategoriesQueryKey
      );

      if (oldData) {
        const newData = JSON.parse(JSON.stringify(oldData));

        for (const category of newData.data ?? []) {
          for (const item of category.items ?? []) {
            for (const variation of item.variations ?? []) {
              if (variation.id === id) {
                Object.assign(variation, variationPatchBody);
                break;
              }
            }
          }
        }

        queryClient.setQueryData(GetCategoriesQueryKey, newData);

        return () => {
          queryClient.setQueryData(GetCategoriesQueryKey, oldData);
        };
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries(GetCategoriesQueryKey);
    },
  });
};
