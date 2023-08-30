"use client";

import { routes } from "@/app/routes";
import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { SquareOauthButton } from "@/components/buttons/SquareOauthButton";
import { useCurrentMerchantQuery } from "@/utils/useCurrentMerchantQuery";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import {
  Alert,
  Box,
  CircularProgress,
  Skeleton,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { MerchantsApiFp } from "moa-merchants-ts-axios";
import { useRouter } from "next-intl/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const oauthAccessCode = searchParams.get("code");
  const { configuration, status } = useSessionedApiConfiguration();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (status === "unauthenticated") {
      push(routes.signin);
    }
  }, [status]);

  const confirmSquareOauthMutation = useMutation({
    mutationFn: async (oauthAccessCode: string) => {
      return (
        await MerchantsApiFp(configuration).confirmSquareOauth(oauthAccessCode)
      )();
    },
  });

  const syncSquareCatalogMutation = useMutation({
    mutationFn: async () => {
      return (await MerchantsApiFp(configuration).syncSquareCatalog())();
    },
  });

  const syncSquareLocationsMutation = useMutation({
    mutationFn: async () => {
      return (await MerchantsApiFp(configuration).syncSquareLocations())();
    },
  });

  const { data: currentMerchantData, isLoading: currentMerchantIsLoading } =
    useCurrentMerchantQuery();

  const [errorString, setErrorString] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      if (oauthAccessCode && status === "authenticated") {
        try {
          await confirmSquareOauthMutation.mutateAsync(oauthAccessCode);
          await syncSquareCatalogMutation.mutateAsync();
          await syncSquareLocationsMutation.mutateAsync();
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
        }
      }
    }

    fetch();
  }, [oauthAccessCode, status]);

  return (
    <Box
      minHeight={"calc(100vh - 120px)"}
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <OnboardingStepper
        activeStep={OnboardingSteps.square}
        sx={{ width: "100%", pt: isSmallScreen ? 0 : 2 }}
      />

      {errorString && (
        <Stack gap={2}>
          <Box justifyContent={"center"} display="flex">
            <Alert severity="error">{errorString}</Alert>
          </Box>

          <Box justifyContent={"center"} display="flex">
            {currentMerchantIsLoading || !currentMerchantData?.id ? (
              <Skeleton height="56px" />
            ) : (
              <SquareOauthButton />
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
        </Stack>
      </Box>
    </Box>
  );
}
