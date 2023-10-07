"use client";

import { FaqAccordion } from "@/components/accordions/CheckoutFaqAccordion";
import { PriceGrid } from "@/components/grids/PriceGrid";
import { OnboardingStepper } from "@/components/steppers/OnboardingStepper";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Container, Stack } from "@mui/material";

export function SetupTierComponent() {
  useRedirectUnauthenticatedSessions();
  const maxHeightCssString = useMaxHeightCssString();

  return (
    <Container sx={{ minHeight: maxHeightCssString }}>
      <Stack spacing={2} justifyContent="center" alignItems="center" py={2}>
        <OnboardingStepper step="checkout" sx={{ width: "100%" }} />
        <PriceGrid />

        <FaqAccordion sx={{ pl: 1 }} />
      </Stack>
    </Container>
  );
}
