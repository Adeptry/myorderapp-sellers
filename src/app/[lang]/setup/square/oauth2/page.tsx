"use client";

import { routes } from "@/app/routes";
import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { Alert, Box, CircularProgress, Stack } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { MerchantsApiFp } from "moa-merchants-ts-axios";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  useRedirectUnauthenticatedSessions();
  const searchParams = useSearchParams();
  const oauthAccessCode = searchParams.get("code");
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  const maxHeightCssString = useMaxHeightCssString();
  const common = useTranslations("Common");
  const { status } = useSession();
  const { push } = useRouter();

  const confirmSquareOauthMutation = useMutation({
    mutationFn: async (oauthAccessCode: string) => {
      return (
        await MerchantsApiFp(sessionedApiConfiguration).confirmSquareOauth(
          oauthAccessCode
        )
      )();
    },
  });

  const syncSquareCatalogMutation = useMutation({
    mutationFn: async () => {
      return (
        await MerchantsApiFp(sessionedApiConfiguration).syncSquareCatalog()
      )();
    },
  });

  const syncSquareLocationsMutation = useMutation({
    mutationFn: async () => {
      return (
        await MerchantsApiFp(sessionedApiConfiguration).syncSquareLocations()
      )();
    },
  });

  const [errorString, setErrorString] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      if (oauthAccessCode && status === "authenticated") {
        try {
          await confirmSquareOauthMutation.mutateAsync(oauthAccessCode);
          await syncSquareCatalogMutation.mutateAsync();
          await syncSquareLocationsMutation.mutateAsync();
          push(routes.setup.catalog);
        } catch (error) {
          if (axios.isAxiosError(error) && error?.response?.status === 422) {
            const message = (error?.response?.data as any).message;
            if (typeof message === "string") {
              setErrorString(message);
            } else {
              setErrorString(common("error"));
            }
          } else {
            setErrorString(common("error"));
          }
        }
      }
    }

    fetch();
  }, [oauthAccessCode, status]);

  return (
    <Stack height={maxHeightCssString}>
      <OnboardingStepper
        activeStep={OnboardingSteps.square}
        sx={{ width: "100%", py: 2 }}
      />

      {errorString && <Alert severity="error">{errorString}</Alert>}
      {!errorString && (
        <Box
          flexGrow={1}
          display={"flex"}
          sx={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Stack>
  );
}
