"use client";

import { routes } from "@/app/routes";
import { useCookieContext } from "@/contexts/CookieContext";
import { moaEnv } from "@/utils/config";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { ShoppingCartCheckout } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  MerchantsApiFp,
  StripeCheckoutCreateDtoCurrencyEnum,
} from "moa-merchants-ts-axios";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useState } from "react";

export function StripeSubscribeButton(props: { fullWidth?: boolean }) {
  const { configuration, status } = useSessionedApiConfiguration();
  const { push } = useRouter();
  const t = useTranslations("Common");
  const { currencyCookieValue } = useCookieContext();

  const createStripeCheckoutQuery = useQuery({
    queryKey: ["createStripeCheckout", currencyCookieValue],
    queryFn: async () => {
      return (
        await (
          await MerchantsApiFp(configuration).createStripeCheckout({
            successUrl: `${moaEnv.frontendUrl}${routes.onboarding.stripe.success}`,
            cancelUrl: `${moaEnv.frontendUrl}${routes.onboarding.stripe.cancel}`,
            currency:
              currencyCookieValue as StripeCheckoutCreateDtoCurrencyEnum,
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
        push(routes.signin);
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
      variant="contained"
      color="secondary"
      size="large"
      onClick={onClickCheckout}
      startIcon={<ShoppingCartCheckout />}
      loading={buttonLoading}
      disabled={buttonLoading}
    >
      {t("subscribe")}
    </LoadingButton>
  );
}
