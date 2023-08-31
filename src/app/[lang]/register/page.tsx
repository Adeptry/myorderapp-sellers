"use client";

import { routes } from "@/app/routes";
import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { SignUpForm } from "@/components/forms/SignUpForm";
import { useCurrentMerchantQuery } from "@/utils/useCurrentMerchantQuery";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import { Box, Stack, useTheme } from "@mui/system";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";

export default function Page() {
  const { push } = useRouter();
  const { status } = useSession();
  const { data } = useCurrentMerchantQuery();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const common = useTranslations("Common");

  useEffect(() => {
    if (data) {
      push(routes.home);
    }
  }, [data]);
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
