"use client";

import { routes } from "@/app/routes";
import { useCookieContext } from "@/contexts/CookieContext";
import { Currency } from "@/types/next";
import { moaEnv } from "@/utils/config";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { ShoppingCartCheckout } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MerchantsApiFp } from "moa-merchants-ts-axios";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useState } from "react";

export function StripeCheckoutButton(props: {
  fullWidth?: boolean;
  isPro: boolean;
}) {
  const { isPro } = props;
  const { status } = useSession();
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  const { push } = useRouter();
  const locale = useLocale();
  const t = useTranslations("StripeCheckoutButton");
  const { currencyCookieValue } = useCookieContext();

  const successRoute = isPro
    ? routes.setup.pro.complete
    : routes.setup.free.complete;
  const successUrl = `${moaEnv.frontendUrl}/${locale}${successRoute}`;
  const cancelUrl = `${moaEnv.frontendUrl}/${locale}${routes.setup.cancel}`;

  const createStripeCheckoutQuery = useQuery({
    queryKey: ["createStripeCheckout", currencyCookieValue, isPro],
    queryFn: async () => {
      const stripePriceId = isPro
        ? moaEnv.stripe.priceIds.pro[
            currencyCookieValue!.toLowerCase() as Currency
          ]
        : moaEnv.stripe.priceIds.free[
            currencyCookieValue!.toLowerCase() as Currency
          ];

      return (
        await (
          await MerchantsApiFp(sessionedApiConfiguration).createStripeCheckout({
            successUrl,
            cancelUrl,
            stripePriceId,
          })
        )()
      ).data;
    },
    enabled: status === "authenticated" && currencyCookieValue !== undefined,
  });

  const [stripeLoadingState, setStripeLoadingState] = useState(false);
  const onClickCheckout = async () => {
    setStripeLoadingState(true);
    try {
      const stripe = await loadStripe(moaEnv.stripePublishableKey!);

      if (stripe && createStripeCheckoutQuery?.data?.checkoutSessionId) {
        stripe.redirectToCheckout({
          sessionId: createStripeCheckoutQuery.data.checkoutSessionId,
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

  if (createStripeCheckoutQuery?.error) {
    return <div>Error: {JSON.stringify(createStripeCheckoutQuery?.error)}</div>;
  }

  const buttonLoading =
    (createStripeCheckoutQuery.isLoading &&
      !createStripeCheckoutQuery.isFetching &&
      !createStripeCheckoutQuery.data) ||
    stripeLoadingState;
  return (
    <LoadingButton
      fullWidth={props.fullWidth}
      variant={isPro ? "contained" : "outlined"}
      color="secondary"
      size="large"
      onClick={onClickCheckout}
      startIcon={<ShoppingCartCheckout />}
      loading={buttonLoading}
      disabled={buttonLoading}
    >
      {isPro ? t("pro") : t("free")}
    </LoadingButton>
  );
}
