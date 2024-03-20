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
      queryClient.invalidateQueries({ queryKey: GetCategoriesQueryKey });
    },
  });
};
