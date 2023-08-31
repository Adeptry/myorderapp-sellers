"use client";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";

export function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const common = useTranslations("Common");
  const locale = useLocale();

  return (
    <FormControl>
      <InputLabel id="language-select-label">{common("language")}</InputLabel>
      <Select
        size="small"
        value={locale}
        label={common("language")}
        onChange={(e) => {
          const newLocale = e.target.value as string;

          // Use router.replace to navigate to the same page in the selected language
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
