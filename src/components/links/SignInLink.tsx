import { routes } from "@/app/routes";
import { MoaLink } from "@/components/links/MoaLink";
import { useTranslations } from "use-intl";

export function SignInLink() {
  const t = useTranslations("SignInLink");
  return (
    <MoaLink href={routes.login} variant="body2" color="secondary">
      {t("text")}
    </MoaLink>
  );
}
