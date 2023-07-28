"use client";

import OnboardingStepper, {
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import SquareOauthButton from "@/components/buttons/SquareOauthButton";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunction } from "@/components/networking/useNetworkingFunction";
import { Alert, Box, Skeleton, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { routes } from "../../routes";

export default function Page() {
  const { push } = useRouter();
  const { merchants, setSession } = useNetworkingContext();
  const [{ data, loading, error }, getCurrentMerchant] = useNetworkingFunction(
    merchants.getCurrentMerchant.bind(merchants),
    true
  );
  const [errorString, setErrorString] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        const response = await getCurrentMerchant({});
        if (!response.data) {
          setSession(null);
          push(routes.signin);
        } else if (response.data.squareId) {
          push(routes.onboarding.catalog);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error?.response?.status === 422) {
          const message = error?.response?.data.message;
          if (typeof message === "string") {
            setErrorString("There was an error. Please try again.");
          }
        } else {
          setErrorString("There was an error. Please try again.");
        }
      }
    }

    fetch();
  }, []);

  const preloading = loading || data?.squareId != undefined;

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

      {errorString && (
        <Alert severity="error" style={{ width: "100%" }}>
          {errorString}
        </Alert>
      )}

      {preloading ? (
        <Skeleton component={"h5"} width={"50px"} />
      ) : (
        <>
          {data && (
            <>
              <Typography variant="h5">Connect your Square Account</Typography>
              <Typography variant="body1">
                To sync your catalog, please authorize our application to
                interact with your Square account. This will grant us
                permissions to fetch your catalog, to submit orders on your
                customers' behalf, and send those order to your point-of-sale
                systems. Don't worry, your data is secured by Square, and you
                can revoke this permission at any time from your Square
                Dashboard.
              </Typography>
            </>
          )}
        </>
      )}

      <Box justifyContent={"center"} display="flex">
        {preloading || !data?.id ? (
          <Skeleton height="56px" width={"192px"} />
        ) : (
          <SquareOauthButton state={data.id} />
        )}
      </Box>
    </Stack>
  );
}
