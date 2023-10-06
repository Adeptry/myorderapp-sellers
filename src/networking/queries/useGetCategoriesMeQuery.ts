import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CatalogsApi } from "myorderapp-square";
import { useSession } from "next-auth/react";

export const GetCategoriesQueryKey = ["getCategoriesMe"];

export const useGetCategoriesMeQuery = () => {
  const { status, update, data: session } = useSession();
  const sessionedApiConfiguration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: GetCategoriesQueryKey,
    queryFn: async () => {
      return (
        await new CatalogsApi(sessionedApiConfiguration).getCategoriesMe({
          items: true,
          images: true,
          variations: true,
          actingAs: "merchant",
        })
      ).data;
    },
    enabled: status === "authenticated",
    retry: (failureCount, error: AxiosError) => {
      if (error?.response?.status === 401 && session !== null) {
        update();
        return failureCount < 3;
      }
      return false;
    },
  });
};
