import { MoaAdaptiveScaffold } from "@/components/layouts/MoaAdaptiveScaffold";
import { SessionedQueryProvider } from "@/components/networking/SessionedQueryProvider";
import { ThemeRegistry } from "@/components/theme/ThemeRegistry";
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
          <SessionedQueryProvider>
            <NextIntlClientProvider
              locale={props.params.lang}
              messages={dictionary}
            >
              <MoaAdaptiveScaffold>{props.children}</MoaAdaptiveScaffold>
            </NextIntlClientProvider>
          </SessionedQueryProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
