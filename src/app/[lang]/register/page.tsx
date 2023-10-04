"use client";

import { routes } from "@/app/routes";
import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { SignUpForm } from "@/components/forms/SignUpForm";
import { useGetMerchantMeQuery } from "@/queries/useGetMerchantMeQuery";
import { useRedirectAuthenticatedSessions } from "@/routing/useRedirectAuthenticatedSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Container, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function Page() {
  useRedirectAuthenticatedSessions();
  const { status } = useSession();
  const { data } = useGetMerchantMeQuery();
  const common = useTranslations("Common");
  const maxHeightCssString = useMaxHeightCssString();

  return (
    <Container sx={{ minHeight: maxHeightCssString }}>
      <OnboardingStepper
        activeStep={OnboardingSteps.signUp}
        sx={{ width: "100%", py: 2 }}
      />

      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Box display="flex" justifyContent="center">
            <Typography component="h1" variant="h4" pb={3}>
              {common("register")}
            </Typography>
          </Box>
          <SignUpForm
            callbackUrl={routes.setup.theme}
            skeleton={status === "loading" || data !== undefined}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
