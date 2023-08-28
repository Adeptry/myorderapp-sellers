import { routes } from "@/app/routes";
import { moaEnv } from "@/utils/config";
import { Button, SxProps } from "@mui/material";
import { default as NextLink } from "next/link";
import { SiSquare } from "react-icons/si";

interface SquareOauthButtonProps {
  state: string;
  scope?: string;
  locale?: string;
  session?: boolean;
  code_challenge?: string;
  redirect_uri?: string;
  sx?: SxProps;
}

export default function SquareOauthButton(props: SquareOauthButtonProps) {
  const {
    state,
    scope = moaEnv.squareScope,
    locale,
    session = true,
    code_challenge,
    redirect_uri,
  } = props;

  let urlString = `${moaEnv.squareBaseUrl}/oauth2/authorize?client_id=${moaEnv.squareClientId}&scope=${scope}&state=${state}`;

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
    moaEnv.squareTestCode != undefined &&
    moaEnv.squareTestCode.length > 0
  ) {
    urlString = `${routes.onboarding.square.oauth2}?code=${moaEnv.squareTestCode}`;
  }

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
      Authorize Square
    </Button>
  );
}
