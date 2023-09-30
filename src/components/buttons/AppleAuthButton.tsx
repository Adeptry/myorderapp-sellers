import { Apple } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";

export function AppleAuthButton() {
  const t = useTranslations("AppleAuthButton");
  return (
    <Button
      variant="outlined"
      startIcon={<Apple />}
      color="secondary"
      fullWidth
      size="large"
      sx={{ whiteSpace: "nowrap" }}
    >
      {t("text")}
    </Button>
  );
}
