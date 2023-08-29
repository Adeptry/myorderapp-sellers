import type { Locale } from "@/types/next";
import "server-only";

const dictionaries = {
  en: () =>
    import("../data/dictionaries/en.json").then((module) => module.default),
  es: () =>
    import("../data/dictionaries/es.json").then((module) => module.default),
  fr: () =>
    import("../data/dictionaries/fr.json").then((module) => module.default),
  ja: () =>
    import("../data/dictionaries/ja.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.en();
