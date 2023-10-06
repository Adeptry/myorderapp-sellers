import { Configuration } from "myorderapp-square";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { moaEnv } from "../moaEnv";

export const useSessionedApiConfiguration = () => {
  const { data } = useSession();
  const locale = useLocale();
  return new Configuration({
    accessToken: data?.user.token,
    apiKey: moaEnv.backendApiKey,
    basePath: moaEnv.backendUrl,
    baseOptions: {
      headers: {
        "x-custom-lang": locale || "en",
      },
    },
  });
};
