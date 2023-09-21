"use client";

import { Tier0SuccessCard } from "@/components/cards/Tier0SuccessCard";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { Stack } from "@mui/material";

export default function Page() {
  useRedirectUnauthenticatedSessions();
  return (
    <Stack spacing={2} display="flex" alignItems="center" py={2}>
      <Tier0SuccessCard sx={{ maxWidth: "sm" }} />
    </Stack>
  );
}
