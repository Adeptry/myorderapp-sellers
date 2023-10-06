import { moaEnv } from "@/moaEnv";
import { Configuration } from "myorderapp-square";
import { Session } from "next-auth";

export function configurationForSession(
  session: Session | null
): Configuration {
  return new Configuration({
    accessToken: session?.user.token,
    apiKey: moaEnv.backendApiKey,
    basePath: moaEnv.backendUrl,
  });
}
