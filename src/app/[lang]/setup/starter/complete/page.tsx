"use client";

import { Tier1SuccessCard } from "@/components/cards/Tier1SuccessCard";
import { constants } from "@/constants";
import { useCookieContext } from "@/contexts/CookieContext";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { Currency } from "@/types/next";
import { gtagEvent } from "@/utils/gtag-event";
import { moaEnv } from "@/utils/moaEnv";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Container, Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
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
        value: constants.currencyToPriceDictionaries[2][currencyCookieValue],
        items: [
          {
            value:
              constants.currencyToPriceDictionaries[2][currencyCookieValue],
            item_id:
              moaEnv.stripe.priceIds[1][
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
        <Tier1SuccessCard sx={{ maxWidth: "sm" }} />
      </Stack>
    </Container>
  );
}
