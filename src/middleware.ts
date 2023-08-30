import clm from "country-locale-map";
import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { constants } from "./constants";

export default async function middleware(request: NextRequest) {
  const nextIntlMiddleware = createMiddleware({
    locales: ["en", "es", "fr", "ja"],
    defaultLocale: "en",
  });
  const response = nextIntlMiddleware(request);

  let currency = request.cookies.get(constants.currencyCookieName)?.value;

  if (!currency) {
    const country = request.geo?.country || "US";
    currency = clm.getCurrencyByAlpha2(country) || "USD";
  }

  response.cookies.set(constants.currencyCookieName, currency);

  return response;
}

export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
