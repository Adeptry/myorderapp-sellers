import type { Locale } from "@/types/next";
import "server-only";

export const getMessages = async (locale: Locale) => {
  const dictionaries = {
    en: () => import("./en.json").then((module) => module.default),
    es: () => import("./es.json").then((module) => module.default),
    fr: () => import("./fr.json").then((module) => module.default),
    ja: () => import("./ja.json").then((module) => module.default),
  };
  return dictionaries[locale]?.() ?? dictionaries.en();
};
