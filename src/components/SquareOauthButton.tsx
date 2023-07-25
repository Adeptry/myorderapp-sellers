import { Button } from "@mui/material";
import { default as NextLink } from "next/link";
import { SiSquare } from "react-icons/si";

export default function SquareOauthButton(props: { state: string }) {
  const urlString = `${process.env.NEXT_PUBLIC_SQUARE_BASE_URL}/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_SQUARE_CLIENT_ID}&scope=${process.env.NEXT_PUBLIC_SQUARE_SCOPE}&state=${props.state}`;
  return (
    <Button
      href={urlString}
      component={NextLink}
      startIcon={<SiSquare />}
      variant="contained"
    >
      Authorize Square
    </Button>
  );
}
