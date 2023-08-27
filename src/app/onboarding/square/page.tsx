"use client";

import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import SquareOauthButton from "@/components/buttons/SquareOauthButton";
import { useCurrentMerchantQuery } from "@/utils/useCurrentMerchantQuery";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { routes } from "../../routes";

export default function Page() {
  const { push } = useRouter();
  const { data } = useCurrentMerchantQuery();
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
    <Stack spacing={2} py={2} textAlign="center">
      <OnboardingStepper
        activeStep={OnboardingSteps.square}
        sx={{ width: "100%" }}
      />

      <Typography variant="h4">Connect your Square Account</Typography>
      <Typography variant="body1">
        To sync your catalog, please authorize our application to interact with
        your Square account. This will grant us permissions to fetch your
        catalog, to submit orders on your customers' behalf, and send those
        order to your point-of-sale systems. Don't worry, your data is secured
        by Square, and you can revoke this permission at any time from your
        Square Dashboard.
      </Typography>

      <Box justifyContent={"center"} display="flex">
        {!data?.id ? (
          <Skeleton height="56px" width={"192px"} />
        ) : (
          <SquareOauthButton state={data.id} />
        )}
      </Box>
    </Stack>
  );
}
