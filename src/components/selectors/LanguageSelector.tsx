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
