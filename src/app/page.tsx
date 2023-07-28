"use client";

import { routes } from "@/app/routes";
import OnboardingStepper, {
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { SignUpForm } from "@/components/forms/SignUpForm";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunction } from "@/components/networking/useNetworkingFunction";
import {
  Box,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { push } = useRouter();
  const { merchants, session } = useNetworkingContext();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const [{ loading }, invoke] = useNetworkingFunction(
    merchants.getCurrentMerchant.bind(merchants),
    true
  );

  useEffect(() => {
    async function fetch() {
      try {
        const response = await invoke({});
        if (response.data) {
          push(routes.home);
        }
      } catch (error) {}
    }

    fetch();
  }, []);

  const preloading = loading || session != null;

  return (
    <Stack pt={3}>
      {!isSm &&
        (preloading ? (
          <Skeleton height={"24px"} sx={{ pb: 3 }} />
        ) : (
          <OnboardingStepper
            activeStep={OnboardingSteps.signUp}
            sx={{ width: "100%", pb: 2 }}
          />
        ))}

      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Box display="flex" justifyContent="center">
            {preloading ? (
              <Skeleton component={"h5"} width={"32px"} sx={{ pb: 2 }} />
            ) : (
              <Typography component="h1" variant="h5" pb={2}>
                Sign up
              </Typography>
            )}
          </Box>

          <SignUpForm
            onSuccess={() => push(routes.onboarding.configurator)}
            preloading={preloading}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
