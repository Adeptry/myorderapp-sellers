import { MoaAdaptiveScaffold } from "@/components/layouts/MoaAdaptiveScaffold";
import { SessionedQueryProvider } from "@/components/networking/SessionedQueryProvider";
import { ThemeRegistry } from "@/components/theme/ThemeRegistry";
import { CookieProvider } from "@/contexts/CookieContext";
import { NextPageProps, i18n } from "@/types/next";
import { getDictionary } from "@/utils/get-dictionary";
import { NextIntlClientProvider } from "next-intl";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout(props: NextPageProps) {
  const dictionary = await getDictionary(props.params.lang);
  return (
    <html lang={props.params.lang}>
      <body>
        <ThemeRegistry>
          <NextIntlClientProvider
            locale={props.params.lang}
            messages={dictionary}
          >
            <CookieProvider>
              <SessionedQueryProvider>
                <MoaAdaptiveScaffold>{props.children}</MoaAdaptiveScaffold>
              </SessionedQueryProvider>
            </CookieProvider>
          </NextIntlClientProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
