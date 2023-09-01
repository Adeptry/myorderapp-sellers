"use client";

import { routes } from "@/app/routes";
import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";

import CheckoutFaqAccordion from "@/components/accordions/CheckoutFaqAccordion";
import { FreeCard } from "@/components/cards/FreeCard";
import { SubscribeCard } from "@/components/cards/SubscribeCard";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function Page() {
  const { push } = useRouter();
  const { status } = useSession();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const common = useTranslations("Common");

  useEffect(() => {
    if (status === "unauthenticated") {
      push(routes.login);
    }
  }, [status]);

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
