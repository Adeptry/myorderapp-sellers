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

import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CatalogsApi } from "myorderapp-square";
import { useSession } from "next-auth/react";

export const GetCategoriesQueryKey = ["getCategoriesMe"];

export const useGetCategoriesMeQuery = () => {
  const { status, update, data: session } = useSession();
  const sessionedApiConfiguration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: GetCategoriesQueryKey,
    queryFn: async () => {
      return (
        await new CatalogsApi(sessionedApiConfiguration).getCategoriesMe({
          items: true,
          images: true,
          variations: true,
          actingAs: "merchant",
        })
      ).data;
    },
    enabled: status === "authenticated",
    retry: (failureCount, error: AxiosError) => {
      if (error?.response?.status === 401 && session !== null) {
        update();
        return failureCount < 3;
      }
      return false;
    },
  });
};
