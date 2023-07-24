"use client";

import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useRequestState } from "@/components/networking/useRequestState";
import { Button } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { StripeCheckoutDto } from "moa-merchants-ts-axios";
import { useEffect } from "react";

export default function Page() {
  const { merchants } = useNetworkingContext();

  const [{ data, loading, error }, setRequestState] =
    useRequestState<StripeCheckoutDto>({ loading: true });

  const frontEndDomain = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN;

  useEffect(() => {
    async function fetch() {
      try {
        const response = await merchants.startStripeCheckout({
          stripeCheckoutCreateDto: {
            successUrl: `${frontEndDomain}/stripe/success`,
            cancelUrl: `${frontEndDomain}/stripe/cancel`,
          },
        });
        setRequestState({
          data: response?.data,
          loading: false,
          error: undefined,
        });
      } catch (error) {
        setRequestState({
          data: undefined,
          loading: false,
          error: axios.isAxiosError(error) ? error.response?.data : error,
        });
      }
    }

    fetch();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  const sessionId = data?.checkoutSessionId;

  return (
    <Button
      variant="contained"
      onClick={async () => {
        const stripe = await loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
        );
        if (stripe && sessionId) {
          stripe.redirectToCheckout({
            sessionId,
          });
        }
      }}
    >
      Checkout with Stripe
    </Button>
  );
}
