"use client";

import { routes } from "@/app/routes";
import OnboardingStepper, {
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunction } from "@/components/networking/useNetworkingFunction";
import { Container } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { push } = useRouter();

  const { merchants } = useNetworkingContext();
  const [{ data, loading, error }, invoke] = useNetworkingFunction(
    merchants.startStripeCheckout.bind(merchants),
    true
  );

  useEffect(() => {
    async function fetch() {
      try {
        const stripe = await loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
        );
        const frontEndDomain = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN;
        const response = await invoke({
          stripeCheckoutCreateDto: {
            successUrl: `${frontEndDomain}${routes.onboarding.stripe.success}`,
            cancelUrl: `${frontEndDomain}${routes.onboarding.stripe.cancel}`,
          },
        });
        if (stripe && response.data.checkoutSessionId) {
          stripe.redirectToCheckout({
            sessionId: response.data.checkoutSessionId,
          });
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status == 401) {
          push("/signin");
          return;
        }
      }
    }

    fetch();
  }, []);

  const sessionId = data?.checkoutSessionId;

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  return (
    <>
      <Container maxWidth="md">
        <OnboardingStepper
          activeStep={OnboardingSteps.checkout}
          sx={{ width: "100%" }}
        />
      </Container>
    </>
  );
}
