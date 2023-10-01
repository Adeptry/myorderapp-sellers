"use client";

import { routes } from "@/app/routes";
import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { SquareOauthExplainerCard } from "@/components/cards/SquareOauthExplainerCard";
import { useGetMerchantMeQuery } from "@/queries/useGetMerchantMeQuery";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";

export default function Page() {
  useRedirectUnauthenticatedSessions();
  const { push } = useRouter();
  const { data } = useGetMerchantMeQuery();

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
