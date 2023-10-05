import GoogleAnalyticsProvider from "@/components/GoogleAnalyticsProvider";
import { SessionedQueryProvider } from "@/components/SessionedQueryProvider";
import { ThemeRegistry } from "@/components/ThemeRegistry";
import { MoaAdaptiveScaffold } from "@/components/layouts/MoaAdaptiveScaffold";
import { CookieProvider } from "@/contexts/CookieContext";
import { NextPageProps, i18n } from "@/types/next";
import { getDictionary } from "@/utils/get-dictionary";
import { moaEnv } from "@/utils/moaEnv";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";

export async function generateMetadata(
  props: NextPageProps
): Promise<Metadata> {
  const dictionary = await getDictionary(props.params.lang);

  return {
    ...dictionary.meta,
    keywords: dictionary.meta.keywords.split(","),
    themeColor: moaEnv.theme.palette.light.primary.main,
    authors: {
      name: "Adeptry",
      url: "https://adeptry.com",
    },
    colorScheme: "light dark",
    viewport: "width=device-width, initial-scale=1.0, viewport-fit=cover",
  };
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout(props: NextPageProps) {
  const dictionary = await getDictionary(props.params.lang);

  return (
    <html lang={props.params.lang}>
      <body>
        <CookieProvider>
          <ThemeRegistry>
            <NextIntlClientProvider
              locale={props.params.lang}
              messages={dictionary}
            >
              <SessionedQueryProvider>
                <GoogleAnalyticsProvider>
                  <MoaAdaptiveScaffold>{props.children}</MoaAdaptiveScaffold>
                </GoogleAnalyticsProvider>
              </SessionedQueryProvider>
            </NextIntlClientProvider>
          </ThemeRegistry>
        </CookieProvider>
        <Analytics />
      </body>
    </html>
  );
}
