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
  sort?: GetOrdersOrderSortEnum | null;
  field?: GetOrdersOrderFieldEnum;
  startDate?: Date;
  endDate?: Date;
}) => {
  const { page, pageSize, sort, field, startDate, endDate } = params;
  const { status } = useSession();
  const sessionedApiConfiguration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: [GetOrdersQueryKey, params],
    queryFn: async () => {
      return (
        await new OrdersApi(sessionedApiConfiguration).getOrders({
          page: page,
          limit: pageSize,
          orderSort: sort ?? undefined,
          orderField: field,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
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
