import { routes } from "@/app/routes";
import { MoaLink } from "@/components/links/MoaLink";
import { useTranslations } from "use-intl";

export function SignUpLink() {
  const t = useTranslations("SignUpLink");
  return (
    <MoaLink href={routes.signup} variant="body2" color="secondary">
      {t("text")}
    </MoaLink>
  );
}
