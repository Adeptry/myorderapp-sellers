import { Button } from "@mui/material";
import { default as NextLink } from "next/link";

export default function SquareOauthButton(props: { state: string }) {
  const urlString = `${process.env.NEXT_PUBLIC_SQUARE_BASE_URL}/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_SQUARE_CLIENT_ID}&scope=${process.env.NEXT_PUBLIC_SQUARE_SCOPE}&state=${props.state}`;
  return (
    <Button href={urlString} component={NextLink} variant="contained">
      Authorize Square
    </Button>
  );
}
