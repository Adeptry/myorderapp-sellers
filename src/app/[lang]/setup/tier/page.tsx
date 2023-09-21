"use client";

import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { Stack } from "@mui/material";

import CheckoutFaqAccordion from "@/components/accordions/CheckoutFaqAccordion";
import PriceGrid from "@/components/grids/PriceGrid";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";

export default function Page() {
  useRedirectUnauthenticatedSessions();

  return (
    <Stack spacing={2} justifyContent="center" alignItems="center" py={2}>
      <OnboardingStepper
        activeStep={OnboardingSteps.checkout}
        sx={{ width: "100%" }}
      />
      <PriceGrid />

      <CheckoutFaqAccordion sx={{ pl: 1 }} />
    </Stack>
  );
}
