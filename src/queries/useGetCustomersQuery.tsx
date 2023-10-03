import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { CustomersApi, GetOrdersOrderSortEnum } from "myorderapp-square";
import { useSession } from "next-auth/react";

export const GetCustomersQueryKey = "getCustomers";

export const useGetCustomersQuery = (params: {
  page: number;
  pageSize: number;
  sort: GetOrdersOrderSortEnum;
  startDate?: Date;
  endDate?: Date;
}) => {
  const { page, pageSize, sort, startDate, endDate } = params;
  const { status } = useSession();
  const sessionedApiConfiguration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: [GetCustomersQueryKey, params],
    queryFn: async () => {
      return (
        await new CustomersApi(sessionedApiConfiguration).getCustomers({
          page,
          limit: pageSize,
          orderSort: sort,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
          user: true,
        })
      ).data;
    },
    enabled: status === "authenticated",
  });
};
