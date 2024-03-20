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

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";

export function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("LanguageSelector");
  const locale = useLocale();

  return (
    <FormControl>
      <InputLabel id="language-select-label">{t("title")}</InputLabel>
      <Select
        size="small"
        value={locale}
        label={t("title")}
        onChange={(e) => {
          const newLocale = e.target.value as string;
          router.replace(pathname, { locale: newLocale });
        }}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="es">Español</MenuItem>
        <MenuItem value="fr">Français</MenuItem>
        <MenuItem value="ja">日本語</MenuItem>
      </Select>
    </FormControl>
  );
}
