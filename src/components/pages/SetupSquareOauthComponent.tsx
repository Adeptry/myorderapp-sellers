"use client";

import { routes } from "@/app/routes";
import { OnboardingStepper } from "@/components/steppers/OnboardingStepper";
import { useGetSquareSyncMeMutation } from "@/networking/mutations/useGetSquareSyncMeMutation";
import { usePostSquareOauthMeMutation } from "@/networking/mutations/usePostSquareOauthMeMutation";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Alert, Box, CircularProgress, Container, Stack } from "@mui/material";
import axios from "axios";
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
  const oauthError = searchParams.get("error");

  const t = useTranslations("SetupSquareOauthComponent");
  const { status } = useSession();
  const { push } = useRouter();

  const postSquareOauthMeMutation = usePostSquareOauthMeMutation();
  const squareSyncMutation = useGetSquareSyncMeMutation();

  const [errorString, setErrorString] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      if (
        oauthAccessCode &&
        status === "authenticated" &&
        !postSquareOauthMeMutation.isPending
      ) {
        try {
          await postSquareOauthMeMutation.mutateAsync(oauthAccessCode);
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
      } else if (oauthError) {
        push(routes.setup.square.index);
      }
    }

    fetch();
  }, [oauthAccessCode, status, oauthError]);

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
