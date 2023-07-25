"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { SignInForm } from "../forms/SignInForm";

export function SignInLayout(props: {
  onSuccess: () => void;
  preloading?: boolean;
}) {
  const { preloading } = props;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography component="h1" variant="h5" py={3}>
        Sign in
      </Typography>
      <SignInForm onSuccess={props.onSuccess} preloading={preloading} />
    </Box>
  );
}
