import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useMutation } from "@tanstack/react-query";
import {
  AuthenticationApi,
  AuthenticationApiPostPasswordForgotRequest,
} from "myorderapp-square";

export const usePostPasswordForgotMutation = () => {
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  return useMutation({
    mutationFn: async (
      authenticationPasswordForgotRequestBody: AuthenticationApiPostPasswordForgotRequest
    ) => {
      return await new AuthenticationApi(
        sessionedApiConfiguration
      ).postPasswordForgot({
        ...authenticationPasswordForgotRequestBody,
      });
    },
  });
};
