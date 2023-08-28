"use client";

import { routes } from "@/app/routes";
import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { SignUpForm } from "@/components/forms/SignUpForm";
import { useCurrentMerchantQuery } from "@/utils/useCurrentMerchantQuery";
import {
  Box,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { push } = useRouter();
  const { status } = useSession();
  const { data } = useCurrentMerchantQuery();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (data) {
      push(routes.dashboard);
    }
  }, [data]);

  return (
    <Stack py={2}>
      <OnboardingStepper
        activeStep={OnboardingSteps.signUp}
        sx={{ width: "100%", pb: 2, pt: isSmallScreen ? 0 : 2 }}
      />

      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Box display="flex" justifyContent="center">
            <Typography component="h1" variant="h4" pb={3}>
              Sign up
            </Typography>
          </Box>
          <SignUpForm
            callbackUrl={routes.onboarding.appearance}
            skeleton={status === "loading" || data !== undefined}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
