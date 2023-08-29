import { ReactNode } from "react";

export const i18n = {
  defaultLocale: "en",
  locales: ["en", "es", "fr", "ja"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

export type NextPageProps = {
  children: ReactNode;
  params: { lang: Locale };
  dictionary: Record<string, any>;
};
