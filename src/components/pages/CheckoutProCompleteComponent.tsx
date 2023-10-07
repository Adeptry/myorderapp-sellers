"use client";

import { Tier2SuccessCard } from "@/components/cards/Tier2SuccessCard";
import { moaEnv } from "@/moaEnv";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { Currency } from "@/types/next";
import { gtagEvent } from "@/utils/gtag-event";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Container, Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useCookieContext } from "../providers/CookieContext";

export function CheckoutProCompleteComponent() {
  useRedirectUnauthenticatedSessions();

  const maxHeightCssString = useMaxHeightCssString();

  const searchParams = useSearchParams();
  const checkoutSessionId = searchParams.get("session_id");
  const { currencyCookieValue } = useCookieContext();

  useEffect(() => {
    if (checkoutSessionId && currencyCookieValue) {
      gtagEvent("purchase", {
        transaction_id: checkoutSessionId,
        currency: currencyCookieValue,
        value: moaEnv.stripe.prices[1][currencyCookieValue as Currency],
        items: [
          {
            value: moaEnv.stripe.prices[1][currencyCookieValue as Currency],
            item_id:
              moaEnv.stripe.priceIds[2][
                currencyCookieValue.toLowerCase() as Currency
              ],
            quantity: 1,
          },
        ],
      });
    }
  }, [checkoutSessionId, currencyCookieValue]);

  return (
    <Container sx={{ minHeight: maxHeightCssString }}>
      <Stack spacing={2} display="flex" alignItems="center" py={2}>
        <Tier2SuccessCard sx={{ maxWidth: "sm" }} />
      </Stack>
    </Container>
  );
}
