import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { OrdersApi, OrdersApiGetOrdersRequest } from "myorderapp-square";
import { useSession } from "next-auth/react";

export const GetOrdersQueryKey = "useOrdersQuery";

export const useGetOrdersQuery = (params: OrdersApiGetOrdersRequest) => {
  const { status } = useSession();
  const sessionedApiConfiguration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: [GetOrdersQueryKey, params],
    queryFn: async () => {
      return (await new OrdersApi(sessionedApiConfiguration).getOrders(params))
        .data;
    },
    enabled: status === "authenticated",
  });
};
