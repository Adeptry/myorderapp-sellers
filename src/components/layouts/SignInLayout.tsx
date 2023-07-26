"use client";

import { Skeleton } from "@mui/material";
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
      {preloading ? (
        <Skeleton component={"h5"} width={"50px"} sx={{ py: 3 }} />
      ) : (
        <Typography component="h1" variant="h5" py={3}>
          Sign in
        </Typography>
      )}
      <SignInForm onSuccess={props.onSuccess} preloading={preloading} />
    </Box>
  );
}
