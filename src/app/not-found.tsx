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

import { AdaptiveScaffoldLayout } from "@/components/layouts/AdaptiveScaffoldLayout";
import { NotFoundComponent } from "@/components/pages/NotFoundComponent";
import { CachedThemeProvider } from "@/components/providers/CachedThemeProvider";
import { CookieProvider } from "@/components/providers/CookieContext";
import { SessionedQueryProvider } from "@/components/providers/SessionedQueryProvider";
import { GoogleAnalyticsScripts } from "@/components/scripts/GoogleAnalyticsScripts";
import { getMessages } from "@/i18n/getMessages";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getMessages("en");
  return dictionary.metadata.notFound;
}

export default async function NotFound() {
  const messages = await getMessages("en");
  return (
    <html lang="en">
      <body>
        <GoogleAnalyticsScripts />
        <CookieProvider>
          <CachedThemeProvider>
            <NextIntlClientProvider locale={"en"} messages={messages}>
              <SessionedQueryProvider>
                <AdaptiveScaffoldLayout>
                  <NotFoundComponent />
                </AdaptiveScaffoldLayout>
              </SessionedQueryProvider>
            </NextIntlClientProvider>
          </CachedThemeProvider>
        </CookieProvider>
      </body>
    </html>
  );
}
