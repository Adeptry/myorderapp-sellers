import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { CustomersApi, GetOrdersOrderSortEnum } from "myorderapp-square";
import { useSession } from "next-auth/react";

export const defaultCurrentCatalogQueryKey = "useCustomersQuery";

export const useCustomersQuery = (params: {
  page: number;
  pageSize: number;
  sort: GetOrdersOrderSortEnum;
}) => {
  const { page, pageSize, sort } = params;
  const { status } = useSession();
  const sessionedApiConfiguration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: [defaultCurrentCatalogQueryKey, page, pageSize],
    queryFn: async () => {
      const api = new CustomersApi(sessionedApiConfiguration);
      return (
        await api.getCustomers({
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
