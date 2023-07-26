"use client";

import { routes } from "@/app/routes";
import OnboardingStepper, {
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { SignUpForm } from "@/components/forms/SignUpForm";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunction } from "@/components/networking/useNetworkingFunction";
import { Container, Skeleton, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { push } = useRouter();
  const { merchants, session } = useNetworkingContext();
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
    <>
      <Container maxWidth="md">
        {preloading ? (
          <Skeleton height={"24px"} />
        ) : (
          <OnboardingStepper activeStep={OnboardingSteps.signUp} />
        )}
      </Container>
      <Container maxWidth="xs">
        <Stack display="flex" flexDirection="column" alignItems="center">
          {preloading ? (
            <Skeleton component={"h5"} width={"32px"} sx={{ py: 3 }} />
          ) : (
            <Typography component="h1" variant="h5" py={3}>
              Sign up
            </Typography>
          )}
          <SignUpForm
            onSuccess={() => push(routes.onboarding.configurator)}
            preloading={preloading}
          />
        </Stack>
      </Container>
    </>
  );
}
