"use client";

import { routes } from "@/app/routes";
import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { SignUpForm } from "@/components/forms/SignUpForm";
import { useCurrentMerchantQuery } from "@/contexts/networking/useCurrentMerchantQuery";
import {
  Box,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { push } = useRouter();

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const currentMerchantQueryState = useCurrentMerchantQuery();

  useEffect(() => {
    if (currentMerchantQueryState.data) {
      push(routes.catalog);
    }
  }, [currentMerchantQueryState.data]);

  return (
    <Stack py={2}>
      {!isSm && (
        <OnboardingStepper
          activeStep={OnboardingSteps.signUp}
          sx={{ width: "100%", pb: 2 }}
        />
      )}

      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Box display="flex" justifyContent="center">
            <Typography component="h1" variant="h4" pb={3}>
              Sign up
            </Typography>
          </Box>
          <SignUpForm onSuccess={() => push(routes.onboarding.configurator)} />
        </Grid>
      </Grid>
    </Stack>
  );
}
