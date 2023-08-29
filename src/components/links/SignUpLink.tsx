import { routes } from "@/app/routes";
import { useTranslations } from "use-intl";
import { MoaLink } from "../MoaLink";

export function SignUpLink() {
  const t = useTranslations("SignUpLink");
  return (
    <MoaLink href={routes.signup} variant="body2" color="secondary">
      {t("text")}
    </MoaLink>
  );
}
