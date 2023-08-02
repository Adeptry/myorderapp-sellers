"use client";

import { routes } from "@/app/routes";
import OnboardingStepper, {
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunctionP } from "@/components/networking/useNetworkingFunctionP";
import { Check, ShoppingCartCheckout } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Stack, Typography } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const { push } = useRouter();

  const { merchants } = useNetworkingContext();
  const [startStripeCheckoutState, startStripeCheckoutFn] =
    useNetworkingFunctionP(
      merchants.startStripeCheckout.bind(merchants),
      false
    );

  const [stripeLoading, setStripeLoading] = useState(false);
  const onClickCheckout = async () => {
    setStripeLoading(true);
    try {
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );
      const frontEndDomain = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN;
      const response = await startStripeCheckoutFn(
        {
          stripeCheckoutCreateDto: {
            successUrl: `${frontEndDomain}${routes.onboarding.stripe.success}`,
            cancelUrl: `${frontEndDomain}${routes.onboarding.stripe.cancel}`,
          },
        },
        {}
      );
      if (stripe && response.data.checkoutSessionId) {
        stripe.redirectToCheckout({
          sessionId: response.data.checkoutSessionId,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status == 401) {
        push(routes.signin);
        return;
      }
    } finally {
      setStripeLoading(false);
    }
  };

  return (
    <Stack spacing={2} py={2} textAlign="center">
      <OnboardingStepper
        activeStep={OnboardingSteps.checkout}
        sx={{ width: "100%" }}
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
            startIcon={
              startStripeCheckoutState.data ? (
                <Check />
              ) : (
                <ShoppingCartCheckout />
              )
            }
            onClick={onClickCheckout}
            loading={stripeLoading}
            disabled={(stripeLoading || startStripeCheckoutState.data) && true}
          >
            {startStripeCheckoutState.data ? "Ready!" : "Return to Checkout"}
          </LoadingButton>
        </Box>
      </Stack>
    </Stack>
  );
}
