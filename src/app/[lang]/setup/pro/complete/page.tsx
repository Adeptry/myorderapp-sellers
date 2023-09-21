"use client";

import { Tier2SuccessCard } from "@/components/cards/Tier2SuccessCard";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { Stack } from "@mui/material";

export default function Page() {
  useRedirectUnauthenticatedSessions();
  return (
    <Stack spacing={2} display="flex" alignItems="center" py={2}>
      <Tier2SuccessCard sx={{ maxWidth: "sm" }} />
    </Stack>
  );
}
