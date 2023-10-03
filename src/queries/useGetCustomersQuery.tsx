import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import {
  CustomersApi,
  CustomersApiGetCustomersRequest,
} from "myorderapp-square";
import { useSession } from "next-auth/react";

export const GetCustomersQueryKey = "getCustomers";

export const useGetCustomersQuery = (
  params: CustomersApiGetCustomersRequest
) => {
  const { status } = useSession();
  const sessionedApiConfiguration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: [GetCustomersQueryKey, params],
    queryFn: async () => {
      return (
        await new CustomersApi(sessionedApiConfiguration).getCustomers(params)
      ).data;
    },
    enabled: status === "authenticated",
  });
};
