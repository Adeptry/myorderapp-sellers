"use client";

import { MenuItem, Select } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";

export function LanguageSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");

  return (
    <Select
      size="small"
      value={t("locale")}
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
  );
}
