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

export async function generateMetadata(props: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const messages = await getMessages(props.params.lang);

  return {
    ...messages.metadata.layout,
    keywords: messages.metadata.layout.keywords.split(","),
    openGraph: {
      ...messages.metadata.layout.openGraph,
      ...openGraphImages,
    },
  };
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
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
