import { routes } from "@/app/routes";
import { moaEnv } from "@/moaEnv";
import { useGetMerchantMeQuery } from "@/networking/queries/useGetMerchantMeQuery";
import { Button, Skeleton, SxProps } from "@mui/material";
import { useTranslations } from "next-intl";
import { default as NextLink } from "next/link";
import { SiSquare } from "react-icons/si";

interface SquareOauthButtonProps {
  scope?: string;
  locale?: string;
  session?: boolean;
  code_challenge?: string;
  redirect_uri?: string;
  sx?: SxProps;
}

export function SquareOauthButton(props: SquareOauthButtonProps) {
  const {
    scope = moaEnv.square.scope,
    locale,
    session = true,
    code_challenge,
    redirect_uri,
  } = props;

  const { data } = useGetMerchantMeQuery();

  const t = useTranslations("SquareOauthButton");

  let urlString = `${moaEnv.square.baseUrl}/oauth2/authorize?client_id=${moaEnv.square.clientId}&scope=${scope}&state=${data?.id}`;

  if (locale) {
    urlString += `&locale=${locale}`;
  }

  urlString += `&session=${session}`;

  if (code_challenge) {
    urlString += `&code_challenge=${code_challenge}`;
  }

  if (redirect_uri) {
    urlString += `&redirect_uri=${redirect_uri}`;
  }

  if (
    moaEnv.env !== "production" &&
    moaEnv.square.testCode != undefined &&
    moaEnv.square.testCode.length > 0
  ) {
    urlString = `${routes.setup.square.sync}?code=${moaEnv.square.testCode}`;
  }

  if (!data?.id) {
    return <Skeleton height="56px" width={"192px"} />;
  } else {
    return (
      <Button
        sx={props.sx}
        href={urlString}
        component={NextLink}
        startIcon={<SiSquare />}
        variant="contained"
        color="secondary"
        size="large"
      >
        {t("text")}
      </Button>
    );
  }
}
