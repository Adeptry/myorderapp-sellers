import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  CustomersApi,
  CustomersApiGetCustomersRequest,
} from "myorderapp-square";
import { useSession } from "next-auth/react";

export const GetCustomersQueryKey = "getCustomers";

export const useGetCustomersQuery = (
  params: CustomersApiGetCustomersRequest
) => {
  const {
    status: authStatus,
    update: updateAuth,
    data: session,
  } = useSession();
  const sessionedApiConfiguration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: [GetCustomersQueryKey, params],
    queryFn: async () => {
      return (
        await new CustomersApi(sessionedApiConfiguration).getCustomers(params)
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
