"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Merchant } from "moa-merchants-ts-axios";
import { SignUpForm } from "../forms/SignUpForm";

export function SignUpLayout(props: {
  onSuccess: (merchant: Merchant) => void;
  preloading?: boolean;
}) {
  const { preloading, onSuccess } = props;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography component="h1" variant="h5" py={3}>
        Sign up
      </Typography>
      <SignUpForm onSuccess={onSuccess} preloading={preloading} />
    </Box>
  );
}
