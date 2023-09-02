"use client";

import { useRedirectSetupSessions } from "@/routing/useRedirectSetupSessions";
import { Stack, Typography } from "@mui/material";

export default function Page() {
  useRedirectSetupSessions();

  return (
    <Stack spacing={2}>
      <Typography>Customers</Typography>
    </Stack>
  );
}
