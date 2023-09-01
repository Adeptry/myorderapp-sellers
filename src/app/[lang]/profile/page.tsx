"use client";

import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { Stack, Typography } from "@mui/material";

export default function Page() {
  useRedirectUnauthenticatedSessions();
  return (
    <Stack spacing={2}>
      <Typography>Hello, account.</Typography>
    </Stack>
  );
}
