import { routes } from "@/app/routes";
import { useTranslations } from "use-intl";
import { MoaLink } from "../MoaLink";

export function SignInLink() {
  const t = useTranslations("SignInLink");
  return (
    <MoaLink href={routes.signin} variant="body2" color="secondary">
      {t("text")}
    </MoaLink>
  );
}
