"use client";

import { routes } from "@/app/routes";
import OnboardingStepper, {
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import SquareOauthButton from "@/components/buttons/SquareOauthButton";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunction } from "@/components/networking/useNetworkingFunction";
import { Alert, Box, CircularProgress, Skeleton, Stack } from "@mui/material";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const oauthAccessCode = searchParams.get("code");
  const { merchants } = useNetworkingContext();
  const [errorString, setErrorString] = useState<string | null>(null);
  const [{}, confirmSquareOauth] = useNetworkingFunction(
    merchants.confirmSquareOauth.bind(merchants)
  );
  const [{}, syncSquareCatalog] = useNetworkingFunction(
    merchants.syncSquareCatalog.bind(merchants)
  );
  const [{}, syncSquareLocations] = useNetworkingFunction(
    merchants.syncSquareLocations.bind(merchants)
  );

  const [
    { data: currentMerchantData, loading: currentMerchantLoading },
    getCurrentMerchant,
  ] = useNetworkingFunction(merchants.getCurrentMerchant.bind(merchants), true);

  useEffect(() => {
    async function fetch() {
      if (oauthAccessCode) {
        try {
          await confirmSquareOauth({ oauthAccessCode });
          await syncSquareCatalog({});
          await syncSquareLocations({});
          push(routes.onboarding.catalog);
        } catch (error) {
          if (axios.isAxiosError(error) && error?.response?.status === 422) {
            const message = error?.response?.data.message;
            if (typeof message === "string") {
              setErrorString("There was an error. Please try again.");
            }
          } else {
            setErrorString("There was an error. Please try again.");
          }

          getCurrentMerchant({});
        }
      }
    }

    fetch();
  }, [oauthAccessCode]);

  return (
    <Box py={2}>
      {errorString && (
        <Stack gap={2}>
          {currentMerchantLoading ? (
            <Skeleton height={"24px"} />
          ) : (
            <OnboardingStepper
              activeStep={OnboardingSteps.square}
              sx={{ width: "100%" }}
            />
          )}

          <Box justifyContent={"center"} display="flex">
            <Alert severity="error">{errorString}</Alert>
          </Box>

          <Box justifyContent={"center"} display="flex">
            {currentMerchantLoading || !currentMerchantData?.id ? (
              <Skeleton height="56px" />
            ) : (
              <SquareOauthButton state={currentMerchantData.id} />
            )}
          </Box>
        </Stack>
      )}
      <Stack alignItems="center">
        <CircularProgress />
      </Stack>
    </Box>
  );
}
