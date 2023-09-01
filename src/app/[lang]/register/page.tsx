"use client";

import { routes } from "@/app/routes";
import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { SignUpForm } from "@/components/forms/SignUpForm";
import { useCurrentMerchantQuery } from "@/queries/useCurrentMerchantQuery";
import { useRedirectAuthenticatedSessions } from "@/routing/useRedirectAuthenticatedSessions";
import { Grid, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function Page() {
  useRedirectAuthenticatedSessions();
  const { status } = useSession();
  const { data } = useCurrentMerchantQuery();
  const common = useTranslations("Common");

  return (
    <Stack py={2}>
      <OnboardingStepper
        activeStep={OnboardingSteps.signUp}
        sx={{ width: "100%", pb: 2 }}
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
    </Stack>
  );
}
