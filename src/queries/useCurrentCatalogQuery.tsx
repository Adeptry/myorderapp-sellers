import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { CatalogsApi } from "moa-merchants-ts-axios";
import { useSession } from "next-auth/react";

export const defaultCurrentCatalogQueryKey = ["getMyCatalog"];

export const useCurrentCatalogQuery = (
  queryKey?: string[] | undefined,
  options?: AxiosRequestConfig
) => {
  const { status } = useSession();
  const sessionedApiConfiguration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: queryKey ?? defaultCurrentCatalogQueryKey,
    queryFn: async () => {
      const catalogsApi = new CatalogsApi(sessionedApiConfiguration);
      return (
        await catalogsApi.getCategoriesMe(
          {
            items: true,
            images: true,
            variations: true,
            actingAs: "merchant",
          },
          options
        )
      ).data;
    },
    enabled: status === "authenticated",
  });
};
