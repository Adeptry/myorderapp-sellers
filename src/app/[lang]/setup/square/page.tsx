"use client";

import { routes } from "@/app/routes";
import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { SquareOauthExplainerCard } from "@/components/cards/SquareOauthExplainerCard";
import { useCurrentMerchantQuery } from "@/queries/useCurrentMerchantQuery";
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
      push(routes.login);
    }
  }, [status]);

  useEffect(() => {
    if (data?.squareId) {
      push(routes.setup.catalog);
    }
  }, [data]);

  return (
    <Stack spacing={2} alignItems={"center"} py={2}>
      <OnboardingStepper
        activeStep={OnboardingSteps.square}
        sx={{ width: "100%" }}
      />

      <SquareOauthExplainerCard
        sx={{
          maxWidth: "sm",
        }}
      />
    </Stack>
  );
}
