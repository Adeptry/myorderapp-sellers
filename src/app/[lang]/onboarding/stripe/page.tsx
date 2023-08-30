"use client";

import { routes } from "@/app/routes";
import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";

import CheckoutFaqAccordion from "@/components/accordions/CheckoutFaqAccordion";
import { FreeCard } from "@/components/cards/FreeCard";
import { SubscribeCard } from "@/components/cards/SubscribeCard";
import { useTranslations } from "next-intl";

export default function Page() {
  const { push } = useRouter();
  const { status } = useSessionedApiConfiguration();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const common = useTranslations("Common");

  useEffect(() => {
    if (status === "unauthenticated") {
      push(routes.signin);
    }
  }, [status]);

  return (
    <Stack spacing={2} justifyContent="center" alignItems="center">
      <OnboardingStepper
        activeStep={OnboardingSteps.checkout}
        sx={{ width: "100%", pt: isSmallScreen ? 0 : 2 }}
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

      <Stack direction={"column"} spacing={2}>
        <Typography variant="h4" align="center">
          {common("frequentlyAskedQuestions")}
        </Typography>
        <CheckoutFaqAccordion sx={{ maxWidth: "md" }} />
      </Stack>
    </Stack>
  );
}
