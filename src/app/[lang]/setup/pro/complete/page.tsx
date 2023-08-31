"use client";

import { StripeProCheckoutSuccessCard } from "@/components/cards/StripeProCheckoutSuccessCard";
import { Stack } from "@mui/material";

export default function Page() {
  return (
    <Stack spacing={2} display="flex" alignItems="center">
      <StripeProCheckoutSuccessCard sx={{ maxWidth: "sm" }} />
    </Stack>
  );
}
