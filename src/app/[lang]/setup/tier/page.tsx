"use client";

import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { Container, Stack } from "@mui/material";

import { FaqAccordion } from "@/components/accordions/CheckoutFaqAccordion";
import { PriceGrid } from "@/components/grids/PriceGrid";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";

export default function Page() {
  useRedirectUnauthenticatedSessions();
  const maxHeightCssString = useMaxHeightCssString();

  return (
    <Container sx={{ minHeight: maxHeightCssString }}>
      <Stack spacing={2} justifyContent="center" alignItems="center" py={2}>
        <OnboardingStepper
          activeStep={OnboardingSteps.checkout}
          sx={{ width: "100%" }}
        />
        <PriceGrid />

        <FaqAccordion sx={{ pl: 1 }} />
      </Stack>
    </Container>
  );
}
