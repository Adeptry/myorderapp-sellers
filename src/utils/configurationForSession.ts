import { Configuration } from "moa-merchants-ts-axios";
import { Session } from "next-auth";

export function configurationForSession(
  session: Session | null
): Configuration {
  return new Configuration({
    accessToken: session?.user.token,
    apiKey: process.env.NEXT_PUBLIC_BACKEND_API_KEY,
    basePath: process.env.NEXT_PUBLIC_BACKEND_DOMAIN,
  });
}
