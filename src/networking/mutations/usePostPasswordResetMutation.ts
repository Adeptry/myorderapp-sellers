import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useMutation } from "@tanstack/react-query";
import {
  AuthenticationApi,
  AuthenticationApiPostPasswordResetRequest,
} from "myorderapp-square";

export const usePostPasswordResetMutation = () => {
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  return useMutation({
    mutationFn: async (
      authenticationPasswordResetRequestBody: AuthenticationApiPostPasswordResetRequest
    ) => {
      return await new AuthenticationApi(
        sessionedApiConfiguration
      ).postPasswordReset(authenticationPasswordResetRequestBody);
    },
  });
};
