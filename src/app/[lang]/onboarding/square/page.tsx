"use client";

import { routes } from "@/app/routes";
import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { SquareOauthExplainerCard } from "@/components/cards/SquareOauthExplainerCard";
import { useCurrentMerchantQuery } from "@/utils/useCurrentMerchantQuery";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";

export default function Page() {
  const { push } = useRouter();
  const { data } = useCurrentMerchantQuery();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      push(routes.signin);
    }
  }, [status]);

  useEffect(() => {
    if (data?.squareId) {
      push(routes.onboarding.catalog);
    }
  }, [data]);

  return (
    <Stack spacing={2} alignItems={"center"}>
      <OnboardingStepper
        activeStep={OnboardingSteps.square}
        sx={{ width: "100%", pt: isSmallScreen ? 0 : 2 }}
      />

      <SquareOauthExplainerCard
        sx={{
          maxWidth: "sm",
        }}
      />
    </Stack>
  );
}
