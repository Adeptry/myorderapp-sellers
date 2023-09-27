import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { CatalogsApi } from "myorderapp-square";
import { useSession } from "next-auth/react";

export const defaultCurrentCatalogQueryKey = ["getMyCatalog"];

export const useCurrentCatalogQuery = (queryKey?: string[] | undefined) => {
  const { status } = useSession();
  const sessionedApiConfiguration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: queryKey ?? defaultCurrentCatalogQueryKey,
    queryFn: async () => {
      const catalogsApi = new CatalogsApi(sessionedApiConfiguration);
      return (
        await catalogsApi.getCategoriesMe({
          items: true,
          images: true,
          variations: true,
          actingAs: "merchant",
        })
      ).data;
    },
    enabled: status === "authenticated",
  });
};
