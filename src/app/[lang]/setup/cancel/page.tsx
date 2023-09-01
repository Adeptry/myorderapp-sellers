"use client";

import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import CheckoutFaqAccordion from "@/components/accordions/CheckoutFaqAccordion";
import { FreeCard } from "@/components/cards/FreeCard";
import { StripeCheckoutCancelledCard } from "@/components/cards/StripeCheckoutCancelledCard";
import { SubscribeCard } from "@/components/cards/SubscribeCard";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { Stack, useMediaQuery, useTheme } from "@mui/material";

export default function Page() {
  useRedirectUnauthenticatedSessions();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Stack spacing={2} alignItems={"center"}>
      <OnboardingStepper
        activeStep={OnboardingSteps.checkout}
        sx={{
          width: "100%",
        }}
      />
      <StripeCheckoutCancelledCard
        sx={{
          maxWidth: "sm",
        }}
      />
      <CheckoutFaqAccordion
        sx={{ maxWidth: "sm", py: isSmallScreen ? 0 : 3 }}
      />
      <Stack
        direction={isSmallScreen ? "column-reverse" : "row"}
        alignItems="flex-end"
        spacing={2}
      >
        <FreeCard />
        <SubscribeCard />
      </Stack>
    </Stack>
  );
}
