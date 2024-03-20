/*
    This code is part of the myorderapp-sellers front-end.
    Copyright (C) 2024  Adeptry, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

import { GetCategoriesQueryKey } from "@/networking/queries/useGetCategoriesMeQuery";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CatalogsApi,
  CategoryPaginatedResponse,
  VariationPatchBody,
} from "myorderapp-square";

export const usePatchVariationMutation = () => {
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      variationPatchBody: VariationPatchBody;
    }) => {
      return await new CatalogsApi(sessionedApiConfiguration).patchVariation({
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
      queryClient.invalidateQueries({ queryKey: GetCategoriesQueryKey });
    },
  });
};
