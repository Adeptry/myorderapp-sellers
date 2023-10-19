import { routes } from "@/app/routes";
import { Apple } from "@mui/icons-material";
import { Button } from "@mui/material";
import { signIn } from "next-auth/react";
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
      onClick={() => {
        signIn("apple", { callbackUrl: routes.setup.index });
      }}
    >
      {t("text")}
    </Button>
  );
}
