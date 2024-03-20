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
import { CachedThemeProvider } from "@/components/providers/CachedThemeProvider";
import { CookieProvider } from "@/components/providers/CookieContext";
import { SessionedQueryProvider } from "@/components/providers/SessionedQueryProvider";
import { GoogleAnalyticsScripts } from "@/components/scripts/GoogleAnalyticsScripts";
import { getMessages } from "@/i18n/getMessages";
import { Locale, NextPageProps, i18n } from "@/types/next";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { openGraphImages } from "../shared-metadata";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata(props: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const messages = await getMessages(props.params.lang);

  return {
    ...messages.metadata.layout,
    keywords: messages.metadata.layout.keywords.split(","),
    openGraph: {
      ...openGraphImages,
      ...messages.metadata.layout.openGraph,
    },
  };
}

export default async function Layout(props: NextPageProps) {
  const messages = await getMessages(props.params.lang);

  return (
    <html lang={props.params.lang}>
      <body>
        <GoogleAnalyticsScripts />
        <CookieProvider>
          <CachedThemeProvider>
            <NextIntlClientProvider
              locale={props.params.lang}
              messages={messages}
            >
              <SessionedQueryProvider>
                <AdaptiveScaffoldLayout>
                  {props.children}
                </AdaptiveScaffoldLayout>
              </SessionedQueryProvider>
            </NextIntlClientProvider>
          </CachedThemeProvider>
        </CookieProvider>
        <Analytics />
      </body>
    </html>
  );
}
