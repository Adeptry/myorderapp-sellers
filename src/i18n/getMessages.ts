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
