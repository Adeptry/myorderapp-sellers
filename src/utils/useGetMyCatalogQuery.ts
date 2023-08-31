import { useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import {
  CatalogsApiFp,
  GetMyCatalogActingAsEnum,
} from "moa-merchants-ts-axios";
import { useSession } from "next-auth/react";
import { useSessionedApiConfiguration } from "./useSessionedApiConfiguration";

export const useGetMyCatalogQuery = (params: {
  page?: number;
  limit?: number;
  locationId?: string;
  items?: boolean;
  images?: boolean;
  variations?: boolean;
  modifierLists?: boolean;
  actingAs?: GetMyCatalogActingAsEnum;
  merchantId?: string;
  options?: AxiosRequestConfig;
}) => {
  const { status } = useSession();
  const sessionedApiConfiguration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: [
      "getMyCatalogQuery",
      params.page,
      params.limit,
      params.locationId,
      params.items,
      params.images,
      params.variations,
      params.modifierLists,
      params.actingAs,
      params.merchantId,
      params.options,
    ],
    queryFn: async () => {
      return (
        await (
          await CatalogsApiFp(sessionedApiConfiguration).getMyCatalog(
            params.page,
            params.limit,
            params.locationId,
            params.items,
            params.images,
            params.variations,
            params.modifierLists,
            params.actingAs,
            params.merchantId,
            params.options
          )
        )()
      ).data;
    },
    enabled: status === "authenticated",
  });
};
