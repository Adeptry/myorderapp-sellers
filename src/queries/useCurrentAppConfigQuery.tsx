import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { AppConfigsApi } from "myorderapp-square";
import { useSession } from "next-auth/react";

export const useCurrentConfigQuery = (params?: { retry?: boolean }) => {
  const { status } = useSession();
  const sessionedApiConfigration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: ["getAppConfigMe"],
    queryFn: async () => {
      const api = new AppConfigsApi(sessionedApiConfigration);
      return (
        await api.getAppConfigMe({
          actingAs: "merchant",
        })
      ).data;
    },
    enabled: status === "authenticated",
    retry: params?.retry,
  });
};
