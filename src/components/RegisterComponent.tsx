"use client";

import { routes } from "@/app/routes";
import { RegisterEmailForm } from "@/components/forms/RegisterEmailForm";
import { OnboardingStepper } from "@/components/steppers/OnboardingStepper";
import { useGetMerchantMeQuery } from "@/queries/useGetMerchantMeQuery";
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
          <RegisterEmailForm
            callbackUrl={routes.setup.theme}
            skeleton={status === "loading" || data !== undefined}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
