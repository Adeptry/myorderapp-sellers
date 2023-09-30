import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import {
  GetOrdersOrderFieldEnum,
  GetOrdersOrderSortEnum,
  OrdersApi,
} from "myorderapp-square";
import { useSession } from "next-auth/react";

export const defaultCurrentCatalogQueryKey = "useOrdersQuery";

export const useOrdersQuery = (params: {
  page: number;
  pageSize: number;
  sort?: GetOrdersOrderSortEnum;
  field?: GetOrdersOrderFieldEnum;
}) => {
  const { page, pageSize, sort, field } = params;
  const { status } = useSession();
  const sessionedApiConfiguration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: [defaultCurrentCatalogQueryKey, page, pageSize],
    queryFn: async () => {
      const api = new OrdersApi(sessionedApiConfiguration);
      return (
        await api.getOrders({
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
