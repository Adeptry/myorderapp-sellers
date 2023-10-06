"use client";

import { routes } from "@/app/routes";
import { OnboardingStepper } from "@/components/steppers/OnboardingStepper";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { Alert, Box, CircularProgress, Container, Stack } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { MerchantsApi } from "myorderapp-square";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function SetupSquareOauthComponent() {
  useRedirectUnauthenticatedSessions();
  const maxHeightCssString = useMaxHeightCssString();

  const searchParams = useSearchParams();
  const oauthAccessCode = searchParams.get("code");
  const sessionedApiConfiguration = useSessionedApiConfiguration();

  const t = useTranslations("SetupSquareOauthComponent");
  const { status } = useSession();
  const { push } = useRouter();

  const postSquareOauthMutationMe = useMutation({
    mutationFn: async (oauthAccessCode: string) => {
      return await new MerchantsApi(
        sessionedApiConfiguration
      ).postSquareOauthMe({
        squarePostOauthBody: {
          oauthAccessCode,
        },
      });
    },
  });

  const squareSyncMutation = useMutation({
    mutationFn: async () => {
      return await new MerchantsApi(
        sessionedApiConfiguration
      ).getSquareSyncMe();
    },
  });

  const [errorString, setErrorString] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      if (oauthAccessCode && status === "authenticated") {
        try {
          await postSquareOauthMutationMe.mutateAsync(oauthAccessCode);
          await squareSyncMutation.mutateAsync();
          push(routes.setup.catalog);
        } catch (error) {
          if (axios.isAxiosError(error) && error?.response?.status === 422) {
            const message = (error?.response?.data as any).message;
            if (typeof message === "string") {
              setErrorString(message);
            } else {
              setErrorString(t("fallbackError"));
            }
          } else {
            setErrorString(t("fallbackError"));
          }
        }
      }
    }

    fetch();
  }, [oauthAccessCode, status]);

  return (
    <Container sx={{ minHeight: maxHeightCssString }}>
      <Stack height={maxHeightCssString}>
        <OnboardingStepper step="square" sx={{ width: "100%", py: 2 }} />
        <Box>
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
        </Box>
      </Stack>
    </Container>
  );
}
