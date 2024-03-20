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
import { RegisterForm } from "@/components/forms/RegisterForm";
import { OnboardingStepper } from "@/components/steppers/OnboardingStepper";
import { useGetMerchantMeQuery } from "@/networking/queries/useGetMerchantMeQuery";
import { useRedirectAuthenticatedSessions } from "@/routing/useRedirectAuthenticatedSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Container, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export function RegisterComponent() {
  useRedirectAuthenticatedSessions();
  const { status } = useSession();
  const { data } = useGetMerchantMeQuery();
  const t = useTranslations("RegisterComponent");
  const maxHeightCssString = useMaxHeightCssString();

  return (
    <Container sx={{ minHeight: maxHeightCssString }}>
      <OnboardingStepper step="signUp" sx={{ width: "100%", py: 2 }} />

      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Box display="flex" justifyContent="center">
            <Typography component="h1" variant="h4" pb={3}>
              {t("title")}
            </Typography>
          </Box>
          <RegisterForm
            callbackUrl={routes.setup.theme}
            skeleton={status === "loading" || data !== undefined}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
