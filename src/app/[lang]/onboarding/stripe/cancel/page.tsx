"use client";

import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import CheckoutFaqAccordion from "@/components/accordions/CheckoutFaqAccordion";
import { FreeCard } from "@/components/cards/FreeCard";
import { StripeCheckoutCancelledCard } from "@/components/cards/StripeCheckoutCancelledCard";
import { SubscribeCard } from "@/components/cards/SubscribeCard";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";

export default function Page() {
  const { push } = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const common = useTranslations("Common");

  return (
    <Stack spacing={2} py={2} alignItems={"center"}>
      <OnboardingStepper
        activeStep={OnboardingSteps.checkout}
        sx={{
          width: "100%",
          pt: isSmallScreen ? 0 : 2,
          pb: isSmallScreen ? 0 : 3,
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
        pb={12}
      >
        <FreeCard />
        <SubscribeCard />
      </Stack>
    </Stack>
  );
}