import { moaEnv } from "@/moaEnv";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  AuthenticationApi,
  AuthenticationApiPostEmailRegisterRequest,
  Configuration,
  MerchantsApi,
} from "myorderapp-square";

export const useRegisterAndPostMerchantMeMutation = () => {
  return useMutation({
    mutationFn: async (body: AuthenticationApiPostEmailRegisterRequest) => {
      try {
        const configuration = new Configuration({
          apiKey: moaEnv.backendApiKey,
          basePath: moaEnv.backendUrl,
        });
        const createUserResponse = await new AuthenticationApi(
          configuration
        ).postEmailRegister({ ...body });

        configuration.accessToken = createUserResponse.data.token;
        try {
          await new MerchantsApi(configuration).postMerchantMe();
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if ((error?.response?.status as number) !== 409) {
              throw error;
            }
          }
        }

        return true;
      } catch (error) {
        throw error;
      }
    },
  });
};
