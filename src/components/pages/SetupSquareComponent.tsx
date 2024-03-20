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
import { SquareOauthExplainerCard } from "@/components/cards/SquareOauthExplainerCard";
import { OnboardingStepper } from "@/components/steppers/OnboardingStepper";
import { useGetMerchantMeQuery } from "@/networking/queries/useGetMerchantMeQuery";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Container, Stack } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";
import { useCookieContext } from "../providers/CookieContext";

export function SetupSquareComponent() {
  useRedirectUnauthenticatedSessions();
  const { push } = useRouter();
  const { data } = useGetMerchantMeQuery();
  const { setNewSquareCsrfTokenCookieValue } = useCookieContext();
  useEffect(() => {
    setNewSquareCsrfTokenCookieValue();
  }, []);

  const maxHeightCssString = useMaxHeightCssString();

  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      push(routes.login);
    }
  }, [status]);

  useEffect(() => {
    if (data?.squareId) {
      push(routes.setup.catalog);
    }
  }, [data]);

  return (
    <Container sx={{ minHeight: maxHeightCssString }}>
      <Stack spacing={2} alignItems={"center"} py={2}>
        <OnboardingStepper step="square" sx={{ width: "100%" }} />

        <SquareOauthExplainerCard
          sx={{
            maxWidth: "sm",
          }}
        />
      </Stack>
    </Container>
  );
}
