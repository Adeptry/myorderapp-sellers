"use client";

import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { FaqAccordion } from "@/components/accordions/CheckoutFaqAccordion";
import { StripeCheckoutCancelledCard } from "@/components/cards/StripeCheckoutCancelledCard";
import { PriceGrid } from "@/components/grids/PriceGrid";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";

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
      <FaqAccordion sx={{ maxWidth: "sm", py: isSmallScreen ? 0 : 3 }} />
      <PriceGrid />
    </Stack>
  );
}
