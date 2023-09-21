"use client";

import { Tier1SuccessCard } from "@/components/cards/Tier1SuccessCard";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { Stack } from "@mui/material";

export default function Page() {
  useRedirectUnauthenticatedSessions();
  return (
    <Stack spacing={2} display="flex" alignItems="center" py={2}>
      <Tier1SuccessCard sx={{ maxWidth: "sm" }} />
    </Stack>
  );
}
