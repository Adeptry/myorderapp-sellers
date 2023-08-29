"use client";

import { routes } from "@/app/routes";
import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { moaEnv } from "@/utils/config";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { ShoppingCartCheckout } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MerchantsApiFp } from "moa-merchants-ts-axios";
import { useRouter } from "next-intl/client";
import { useState } from "react";

export default function Page() {
  const { push } = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const { configuration, status } = useSessionedApiConfiguration();
  const createStripeCheckoutQuery = useQuery({
    queryFn: async () => {
      return (
        await (
          await MerchantsApiFp(configuration).createStripeCheckout({
            successUrl: `${moaEnv.frontendUrl}${routes.onboarding.stripe.success}`,
            cancelUrl: `${moaEnv.frontendUrl}${routes.onboarding.stripe.cancel}`,
          })
        )()
      ).data;
    },
    enabled: status === "authenticated",
  });

  const [stripeLoadingState, setStripeLoadingState] = useState(false);
  const onClickCheckout = async () => {
    setStripeLoadingState(true);
    try {
      const stripe = await loadStripe(moaEnv.stripePublishableKey);

      if (stripe && createStripeCheckoutQuery?.data?.checkoutSessionId) {
        stripe.redirectToCheckout({
          sessionId: createStripeCheckoutQuery.data.checkoutSessionId,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status == 401) {
        push(routes.signin);
        return;
      }
    } finally {
      setStripeLoadingState(false);
    }
  };

  const buttonLoading =
    (createStripeCheckoutQuery.isLoading &&
      !createStripeCheckoutQuery.isFetching &&
      !createStripeCheckoutQuery.data) ||
    stripeLoadingState;

  return (
    <Stack spacing={2} py={2} textAlign="center">
      <OnboardingStepper
        activeStep={OnboardingSteps.checkout}
        sx={{ width: "100%", pt: isSmallScreen ? 0 : 2 }}
      />
      <Stack spacing={2}>
        <Typography variant="h4">We're sorry to see you go</Typography>
        <Typography variant="body1">
          We understand you're busy - there's no rush! Whenever you're ready,
          you can return to complete your account setup. Simply log in and pick
          up where you left off. If you're ready to finish up now, click the
          button below to jump back into the checkout process. While you wait,
          feel free to explore and customize your app and catalog from the menu.
          Your progress will always be saved, for your convenience.
        </Typography>
        <Box>
          <LoadingButton
            variant="contained"
            color="secondary"
            size="large"
            onClick={onClickCheckout}
            startIcon={<ShoppingCartCheckout />}
            loading={buttonLoading}
            disabled={buttonLoading}
          >
            Proceed to Checkout
          </LoadingButton>
        </Box>
      </Stack>
    </Stack>
  );
}
