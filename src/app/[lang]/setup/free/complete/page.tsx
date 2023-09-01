"use client";

import { StripeFreeCheckoutSuccessCard } from "@/components/cards/StripeFreeCheckoutSuccessCard";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { Stack } from "@mui/material";

export default function Page() {
  useRedirectUnauthenticatedSessions();
  return (
    <Stack spacing={2} display="flex" alignItems="center" py={2}>
      <StripeFreeCheckoutSuccessCard sx={{ maxWidth: "sm" }} />
    </Stack>
  );
}
