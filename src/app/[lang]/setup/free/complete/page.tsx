"use client";

import { StripeFreeCheckoutSuccessCard } from "@/components/cards/StripeFreeCheckoutSuccessCard";
import { Stack } from "@mui/material";

export default function Page() {
  return (
    <Stack spacing={2} display="flex" alignItems="center" py={2}>
      <StripeFreeCheckoutSuccessCard sx={{ maxWidth: "sm" }} />
    </Stack>
  );
}
