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
