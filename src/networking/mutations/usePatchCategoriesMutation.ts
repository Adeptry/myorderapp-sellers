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
      queryClient.invalidateQueries({ queryKey: GetCategoriesQueryKey });
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
