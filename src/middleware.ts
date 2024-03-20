/*
    This code is part of the myorderapp-sellers front-end.
    Copyright (C) 2024  Adeptry, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

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
    // const country = request.geo?.country || "US";
    currency = "usd";
  }

  response.cookies.set(constants.currencyCookieName, currency);

  return response;
}

export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
