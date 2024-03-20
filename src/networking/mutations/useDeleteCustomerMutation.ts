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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CustomersApi,
  CustomersApiDeleteCustomerIdRequest,
  MerchantsApi,
} from "myorderapp-square";
import { GetCustomersQueryKey } from "../queries/useGetCustomersQuery";

export const useDeleteCustomerMutation = () => {
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      requestParameters: CustomersApiDeleteCustomerIdRequest
    ) => {
      return await new CustomersApi(sessionedApiConfiguration).deleteCustomerId(
        requestParameters
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [GetCustomersQueryKey] });
    },
  });
};
