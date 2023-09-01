"use client";

import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { Stack, useMediaQuery, useTheme } from "@mui/material";

import CheckoutFaqAccordion from "@/components/accordions/CheckoutFaqAccordion";
import { FreeCard } from "@/components/cards/FreeCard";
import { SubscribeCard } from "@/components/cards/SubscribeCard";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";

export default function Page() {
  useRedirectUnauthenticatedSessions();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Stack spacing={2} justifyContent="center" alignItems="center" py={2}>
      <OnboardingStepper
        activeStep={OnboardingSteps.checkout}
        sx={{ width: "100%" }}
      />
      <Stack
        direction={isSmallScreen ? "column-reverse" : "row"}
        alignItems="flex-end"
        justifyContent="center"
        spacing={2}
      >
        <FreeCard />
        <SubscribeCard />
      </Stack>

      <CheckoutFaqAccordion />
    </Stack>
  );
}
