import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import {
  OrdersApi,
  OrdersApiGetOrderStatisticsMeRequest,
} from "myorderapp-square";
import { useSession } from "next-auth/react";

export const GetOrderStatisticsMeKey = "useOrderStatisticsMe";

export const useGetOrderStatisticsMeQuery = (
  params: OrdersApiGetOrderStatisticsMeRequest
) => {
  const { status } = useSession();
  const sessionedApiConfiguration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: [GetOrderStatisticsMeKey, params],
    queryFn: async () => {
      return (
        await new OrdersApi(sessionedApiConfiguration).getOrderStatisticsMe(
          params
        )
      ).data;
    },
    enabled: status === "authenticated",
  });
};
