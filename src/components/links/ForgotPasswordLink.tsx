import { routes } from "@/app/routes";
import { MoaLink } from "@/components/links/MoaLink";
import { useTranslations } from "use-intl";

export function ForgotPasswordLink() {
  const t = useTranslations("ForgotPasswordLink");
  return (
    <MoaLink
      href={routes.resetPassword.index}
      variant="body2"
      color="secondary"
    >
      {t("text")}
    </MoaLink>
  );
}
