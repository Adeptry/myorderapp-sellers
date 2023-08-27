import { routes } from "@/app/routes";
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
    scope = process.env.NEXT_PUBLIC_SQUARE_SCOPE,
    locale,
    session = true,
    code_challenge,
    redirect_uri,
  } = props;

  let urlString = `${process.env.NEXT_PUBLIC_SQUARE_BASE_URL}/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_SQUARE_CLIENT_ID}&scope=${scope}&state=${state}`;

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

  const testCode = process.env.NEXT_PUBLIC_SQUARE_TEST_CODE;
  if (
    process.env.NEXT_PUBLIC_ENV !== "production" &&
    testCode != undefined &&
    testCode.length > 0
  ) {
    urlString = `${routes.onboarding.square.oauth2}?code=${testCode}`;
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
