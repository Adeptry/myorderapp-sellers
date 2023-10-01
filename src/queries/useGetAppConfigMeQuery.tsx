import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { AppConfigsApi } from "myorderapp-square";
import { useSession } from "next-auth/react";

export const useGetAppConfigMeQuery = (params?: { retry?: boolean }) => {
  const { status } = useSession();
  const sessionedApiConfigration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: ["getAppConfigMe"],
    queryFn: async () => {
      return (
        await new AppConfigsApi(sessionedApiConfigration).getAppConfigMe({
          actingAs: "merchant",
        })
      ).data;
    },
    enabled: status === "authenticated",
    retry: params?.retry,
  });
};
