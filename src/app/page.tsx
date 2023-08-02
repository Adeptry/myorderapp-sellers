"use client";

import { routes } from "@/app/routes";
import OnboardingStepper, {
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { SignUpForm } from "@/components/forms/SignUpForm";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunctionNP } from "@/components/networking/useNetworkingFunctionNP";
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
  const [{ loading }, invoke] = useNetworkingFunctionNP(
    merchants.getCurrentMerchant.bind(merchants),
    true
  );

  useEffect(() => {
    async function fetch() {
      try {
        const response = await invoke({});
        if (response.data) {
          push(routes.catalog);
        }
      } catch (error) {}
    }

    fetch();
  }, []);

  const preloading = loading || session != null;

  return (
    <Stack py={2}>
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
              <Skeleton component={"h4"} width={"32px"} sx={{ pb: 3 }} />
            ) : (
              <Typography component="h1" variant="h4" pb={3}>
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
