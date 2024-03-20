/*
    This code is part of the myorderapp-sellers front-end.
    Copyright (C) 2024  Adeptry, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

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
import { useCookieContext } from "../providers/CookieContext";

export function SetupSquareOauthComponent() {
  useRedirectUnauthenticatedSessions();
  const maxHeightCssString = useMaxHeightCssString();

  const searchParams = useSearchParams();
  const oauthState = searchParams.get("state");
  const oauthAccessCode = searchParams.get("code");
  const oauthError = searchParams.get("error");

  const t = useTranslations("SetupSquareOauthComponent");
  const { status } = useSession();
  const { push } = useRouter();

  const postSquareOauthMeMutation = usePostSquareOauthMeMutation();
  const squareSyncMutation = useGetSquareSyncMeMutation();

  const [errorString, setErrorString] = useState<string | null>(null);
  const { squareCsrfTokenCookieValue } = useCookieContext();

  useEffect(() => {
    async function fetch() {
      if (
        oauthAccessCode &&
        oauthState &&
        squareCsrfTokenCookieValue &&
        oauthState === squareCsrfTokenCookieValue &&
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
      } else if (
        oauthError ||
        (oauthState != undefined &&
          squareCsrfTokenCookieValue != undefined &&
          oauthState !== squareCsrfTokenCookieValue)
      ) {
        push(routes.setup.square.index);
      }
    }

    fetch();
  }, [
    oauthAccessCode,
    status,
    oauthError,
    oauthState,
    squareCsrfTokenCookieValue,
  ]);

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
