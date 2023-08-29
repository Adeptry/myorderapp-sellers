import { Google } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";

export default function GoogleAuthButton() {
  const t = useTranslations("GoogleAuthButton");
  return (
    <Button
      variant="outlined"
      color="secondary"
      startIcon={<Google />}
      size="large"
      fullWidth
      sx={{ whiteSpace: "nowrap" }}
    >
      {t("text")}
    </Button>
  );
}
