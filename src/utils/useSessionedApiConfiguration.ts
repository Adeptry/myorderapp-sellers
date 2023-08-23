import { Configuration } from "moa-merchants-ts-axios";
import { useSession } from "next-auth/react";

export const useSessionedApiConfiguration = () => {
  const { data: session, status } = useSession();

  return {
    configuration: new Configuration({
      accessToken: session?.user.token,
      apiKey: process.env.NEXT_PUBLIC_BACKEND_API_KEY,
      basePath: process.env.NEXT_PUBLIC_BACKEND_DOMAIN,
    }),
    preloading: status === "loading",
  };
};
