"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Merchant } from "moa-merchants-ts-axios";
import { SignUpForm } from "../forms/SignUpForm";

export function SignUpLayout(props: {
  onSuccess: (merchant: Merchant) => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>
      <SignUpForm onSuccess={props.onSuccess} />
    </Box>
  );
}
