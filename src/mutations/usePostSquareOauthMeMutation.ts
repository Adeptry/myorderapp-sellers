import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useMutation } from "@tanstack/react-query";
import { MerchantsApi } from "myorderapp-square";

export const usePostSquareOauthMeMutation = () => {
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  return useMutation({
    mutationFn: async (oauthAccessCode: string) => {
      return await new MerchantsApi(
        sessionedApiConfiguration
      ).postSquareOauthMe({
        squarePostOauthBody: {
          oauthAccessCode,
        },
      });
    },
  });
};
