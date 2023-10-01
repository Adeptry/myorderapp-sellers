import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { CustomersApi, GetOrdersOrderSortEnum } from "myorderapp-square";
import { useSession } from "next-auth/react";

export const GetCustomersQueryKey = "getCustomers";

export const useGetCustomersQuery = (params: {
  page: number;
  pageSize: number;
  sort: GetOrdersOrderSortEnum;
}) => {
  const { page, pageSize, sort } = params;
  const { status } = useSession();
  const sessionedApiConfiguration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: [GetCustomersQueryKey, page, pageSize],
    queryFn: async () => {
      return (
        await new CustomersApi(sessionedApiConfiguration).getCustomers({
          page,
          limit: pageSize,
          orderSort: sort,
          user: true,
        })
      ).data;
    },
    enabled: status === "authenticated",
  });
};
