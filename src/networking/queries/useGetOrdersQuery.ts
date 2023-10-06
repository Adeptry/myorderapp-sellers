import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { OrdersApi, OrdersApiGetOrdersRequest } from "myorderapp-square";
import { useSession } from "next-auth/react";

export const GetOrdersQueryKey = "useOrdersQuery";

export const useGetOrdersQuery = (params: OrdersApiGetOrdersRequest) => {
  const {
    status: authStatus,
    update: updateAuth,
    data: session,
  } = useSession();

  const sessionedApiConfiguration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: [GetOrdersQueryKey, params],
    queryFn: async () => {
      return (await new OrdersApi(sessionedApiConfiguration).getOrders(params))
        .data;
    },
    enabled: authStatus === "authenticated",
    retry: (failureCount, error: AxiosError) => {
      if (error?.response?.status === 401 && session !== null) {
        updateAuth();
        return failureCount < 3;
      }
      return false;
    },
  });
};
