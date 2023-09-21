"use client";

import { routes } from "@/app/routes";
import { useCookieContext } from "@/contexts/CookieContext";
import { Currency } from "@/types/next";
import { moaEnv } from "@/utils/moaEnv";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { ShoppingCartCheckout } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MerchantsApi } from "moa-merchants-ts-axios";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useState } from "react";

export function StripeCheckoutButton(props: {
  fullWidth?: boolean;
  tier: number;
  text?: string;
}) {
  const { tier } = props;
  const { status } = useSession();
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  const { push } = useRouter();
  const locale = useLocale();
  const t = useTranslations("Common");
  const { currencyCookieValue } = useCookieContext();

  let sucessPathComponent = "";

  switch (tier) {
    case 0:
      sucessPathComponent = routes.setup.free.complete;
      break;
    case 1:
      sucessPathComponent = routes.setup.starter.complete;
      break;
    case 2:
      sucessPathComponent = routes.setup.pro.complete;
      break;
    default:
      break;
  }

  const successUrl = `${moaEnv.frontendUrl}/${locale}${sucessPathComponent}`;
  const cancelUrl = `${moaEnv.frontendUrl}/${locale}${routes.setup.cancel}`;

  const postMeStripeCheckoutQuery = useQuery({
    queryKey: ["postMeStripeCheckoutQuery", currencyCookieValue, tier],
    queryFn: async () => {
      const stripePriceId =
        moaEnv.stripe.priceIds[tier][
          currencyCookieValue!.toLowerCase() as Currency
        ];

      const api = new MerchantsApi(sessionedApiConfiguration);
      return (
        await api.postMeStripeCheckout({
          stripeCheckoutCreateDto: {
            successUrl,
            cancelUrl,
            stripePriceId,
          },
        })
      ).data;
    },
    enabled: status === "authenticated" && currencyCookieValue !== undefined,
  });

  const [stripeLoadingState, setStripeLoadingState] = useState(false);
  const onClickCheckout = async () => {
    setStripeLoadingState(true);
    try {
      const stripe = await loadStripe(moaEnv.stripePublishableKey!);

      if (stripe && postMeStripeCheckoutQuery?.data?.checkoutSessionId) {
        stripe.redirectToCheckout({
          sessionId: postMeStripeCheckoutQuery.data.checkoutSessionId,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status == 401) {
        push(routes.login);
        return;
      }
    } finally {
      setStripeLoadingState(false);
    }
  };

  if (postMeStripeCheckoutQuery?.error) {
    return <div>Error: {JSON.stringify(postMeStripeCheckoutQuery?.error)}</div>;
  }

  const buttonLoading =
    (postMeStripeCheckoutQuery.isLoading &&
      !postMeStripeCheckoutQuery.isFetching &&
      !postMeStripeCheckoutQuery.data) ||
    stripeLoadingState;
  return (
    <LoadingButton
      fullWidth={props.fullWidth}
      variant={"contained"}
      color="secondary"
      size="large"
      onClick={onClickCheckout}
      startIcon={<ShoppingCartCheckout />}
      loading={buttonLoading}
      disabled={buttonLoading}
    >
      {props.text ?? t("subscribe")}
    </LoadingButton>
  );
}
