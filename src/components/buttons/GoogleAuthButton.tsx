import { routes } from "@/app/routes";
import { Google } from "@mui/icons-material";
import { Button } from "@mui/material";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

export function GoogleAuthButton() {
  const t = useTranslations("GoogleAuthButton");
  return (
    <Button
      variant="outlined"
      color="secondary"
      startIcon={<Google />}
      size="large"
      fullWidth
      sx={{ whiteSpace: "nowrap" }}
      onClick={() => {
        signIn("google", { callbackUrl: routes.setup.index });
      }}
    >
      {t("text")}
    </Button>
  );
}
