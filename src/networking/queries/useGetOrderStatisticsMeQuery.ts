import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  OrdersApi,
  OrdersApiGetOrderStatisticsMeRequest,
} from "myorderapp-square";
import { useSession } from "next-auth/react";

export const GetOrderStatisticsMeKey = "useOrderStatisticsMe";

export const useGetOrderStatisticsMeQuery = (
  params: OrdersApiGetOrderStatisticsMeRequest
) => {
  const {
    status: authStatus,
    update: updateAuth,
    data: session,
  } = useSession();
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
