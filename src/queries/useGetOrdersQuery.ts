import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import {
  GetOrdersOrderFieldEnum,
  GetOrdersOrderSortEnum,
  OrdersApi,
} from "myorderapp-square";
import { useSession } from "next-auth/react";

export const GetOrdersQueryKey = "useOrdersQuery";

export const useGetOrdersQuery = (params: {
  page: number;
  pageSize: number;
  sort?: GetOrdersOrderSortEnum;
  field?: GetOrdersOrderFieldEnum;
}) => {
  const { page, pageSize, sort, field } = params;
  const { status } = useSession();
  const sessionedApiConfiguration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: [GetOrdersQueryKey, page, pageSize],
    queryFn: async () => {
      return (
        await new OrdersApi(sessionedApiConfiguration).getOrders({
          page: page,
          limit: pageSize,
          orderSort: sort,
          orderField: field,
          lineItems: true,
          location: true,
          customer: true,
          actingAs: "merchant",
        })
      ).data;
    },
    enabled: status === "authenticated",
  });
};
