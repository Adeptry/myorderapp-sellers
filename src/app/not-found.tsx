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
