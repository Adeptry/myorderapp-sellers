import { routes } from "@/app/routes";
import { useTranslations } from "use-intl";
import { MoaLink } from "../MoaLink";

export function ForgotPasswordLink() {
  const t = useTranslations("ForgotPasswordLink");
  return (
    <MoaLink href={routes.forgot} variant="body2" color="secondary">
      {t("text")}
    </MoaLink>
  );
}
