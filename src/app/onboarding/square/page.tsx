"use client";

import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import SquareOauthButton from "@/components/buttons/SquareOauthButton";
import { useCurrentMerchantQuery } from "@/contexts/networking/useCurrentMerchantQuery";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { routes } from "../../routes";

export default function Page() {
  const { push } = useRouter();
  const currentMerchantQueryState = useCurrentMerchantQuery();

  useEffect(() => {
    if (!currentMerchantQueryState.data?.data) {
      push(routes.signin);
    } else if (currentMerchantQueryState.data?.data.squareId) {
      push(routes.onboarding.catalog);
    }
  }, [currentMerchantQueryState.data]);

  const preloading =
    currentMerchantQueryState.isFetching &&
    !currentMerchantQueryState.isFetched;

  return (
    <Stack spacing={2} py={2} textAlign="center">
      {preloading ? (
        <Skeleton height={"24px"} />
      ) : (
        <OnboardingStepper
          activeStep={OnboardingSteps.square}
          sx={{ width: "100%" }}
        />
      )}

      {preloading ? (
        <Box display="flex" justifyContent="center">
          <Skeleton component={"h4"} width={"50px"} />
        </Box>
      ) : (
        <>
          <Typography variant="h4">Connect your Square Account</Typography>
          <Typography variant="body1">
            To sync your catalog, please authorize our application to interact
            with your Square account. This will grant us permissions to fetch
            your catalog, to submit orders on your customers' behalf, and send
            those order to your point-of-sale systems. Don't worry, your data is
            secured by Square, and you can revoke this permission at any time
            from your Square Dashboard.
          </Typography>
        </>
      )}

      <Box justifyContent={"center"} display="flex">
        {preloading || !currentMerchantQueryState.data?.data?.id ? (
          <Skeleton height="56px" width={"192px"} />
        ) : (
          <SquareOauthButton state={currentMerchantQueryState.data.data.id} />
        )}
      </Box>
    </Stack>
  );
}
