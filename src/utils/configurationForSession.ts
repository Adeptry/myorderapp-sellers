import { moaEnv } from "@/utils/config";
import { Configuration } from "moa-merchants-ts-axios";
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
