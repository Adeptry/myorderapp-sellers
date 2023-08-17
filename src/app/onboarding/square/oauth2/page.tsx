"use client";

import { routes } from "@/app/routes";
import OnboardingStepper, {
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import SquareOauthButton from "@/components/buttons/SquareOauthButton";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunctionNP } from "@/components/networking/useNetworkingFunctionNP";
import { useNetworkingFunctionP } from "@/components/networking/useNetworkingFunctionP";
import {
  Alert,
  Box,
  CircularProgress,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const oauthAccessCode = searchParams.get("code");
  const { merchants } = useNetworkingContext();

  const [{}, confirmSquareOauth] = useNetworkingFunctionP(
    merchants.confirmSquareOauth.bind(merchants)
  );
  const [{ loading: syncSquareCatalogLoading }, syncSquareCatalog] =
    useNetworkingFunctionNP(merchants.syncSquareCatalog.bind(merchants));
  const [{ loading: syncSquareLocationsLoading }, syncSquareLocations] =
    useNetworkingFunctionNP(merchants.syncSquareLocations.bind(merchants));
  const [
    { data: currentMerchantData, loading: currentMerchantLoading },
    getCurrentMerchant,
  ] = useNetworkingFunctionNP(
    merchants.getCurrentMerchant.bind(merchants),
    true
  );

  const [errorString, setErrorString] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      if (oauthAccessCode) {
        try {
          await confirmSquareOauth({ oauthAccessCode }, {});
          await syncSquareCatalog({});
          await syncSquareLocations({});
          push(routes.onboarding.catalog);
        } catch (error) {
          if (axios.isAxiosError(error) && error?.response?.status === 422) {
            const message = (error?.response?.data as any).message;
            if (typeof message === "string") {
              setErrorString(message);
            } else {
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
    <Box
      py={2}
      minHeight={"calc(100vh - 120px)"}
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <OnboardingStepper
        activeStep={OnboardingSteps.square}
        sx={{ width: "100%" }}
      />

      {errorString && (
        <Stack gap={2}>
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

      <Box
        flex={1}
        overflow="auto"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Stack display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
          {syncSquareCatalogLoading && (
            <Typography variant="body2">Syncing Square Catalog...</Typography>
          )}
          {syncSquareLocationsLoading && (
            <Typography variant="body2">Syncing Square Locations...</Typography>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
