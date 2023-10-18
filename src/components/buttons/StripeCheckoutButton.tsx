import { routes } from "@/app/routes";
import { moaEnv } from "@/moaEnv";
import { Currency } from "@/types/next";
import { gtagEvent } from "@/utils/gtag-event";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { ShoppingCartCheckout } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MerchantsApi } from "myorderapp-square";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useState } from "react";
import { useCookieContext } from "../providers/CookieContext";

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
  const t = useTranslations("StripeCheckoutButton");
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

  const successUrl = `${moaEnv.siteUrl}/${locale}${sucessPathComponent}?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${moaEnv.siteUrl}/${locale}${routes.setup.cancel}`;

  const currency = currencyCookieValue
    ? (currencyCookieValue?.toLowerCase() as Currency)
    : undefined;
  const tierPriceIds = moaEnv.stripe.priceIds[tier];
  const stripePriceId = currency && tierPriceIds[currency];
  const isAvailable = !(currency != undefined && stripePriceId == undefined);

  const postStripeCheckoutQueryMe = useQuery({
    queryKey: ["postStripeCheckoutQueryMe", stripePriceId],
    queryFn: async () => {
      const api = new MerchantsApi(sessionedApiConfiguration);
      return (
        await api.postStripeCheckoutMe({
          stripePostCheckoutBody: {
            successUrl,
            cancelUrl,
            stripePriceId: stripePriceId!,
          },
        })
      ).data;
    },
    enabled: status === "authenticated" && stripePriceId !== undefined,
  });

  const [stripeLoadingState, setStripeLoadingState] = useState(false);
  const onClickCheckout = async () => {
    setStripeLoadingState(true);
    try {
      const stripe = await loadStripe(moaEnv.stripe.publishableKey);

      if (stripe && postStripeCheckoutQueryMe?.data?.checkoutSessionId) {
        gtagEvent("begin_checkout", {
          currency: currencyCookieValue,
          value: moaEnv.stripe.prices[tier][currencyCookieValue as Currency],
          items: [
            {
              value: moaEnv.stripe.prices[2][currencyCookieValue as Currency],
              item_id:
                moaEnv.stripe.priceIds[tier][
                  currencyCookieValue?.toLowerCase() as Currency
                ],
              quantity: 1,
            },
          ],
        });
        stripe.redirectToCheckout({
          sessionId: postStripeCheckoutQueryMe.data.checkoutSessionId,
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

  if (postStripeCheckoutQueryMe?.error) {
    return <div>Error: {JSON.stringify(postStripeCheckoutQueryMe?.error)}</div>;
  }

  const isLoading =
    (postStripeCheckoutQueryMe.isLoading &&
      !postStripeCheckoutQueryMe.isFetching &&
      !postStripeCheckoutQueryMe.data) ||
    stripeLoadingState;
  return (
    <LoadingButton
      fullWidth={props.fullWidth}
      variant={"contained"}
      color="secondary"
      size="large"
      onClick={onClickCheckout}
      startIcon={<ShoppingCartCheckout />}
      loading={isLoading && isAvailable}
      disabled={isLoading || !isAvailable}
    >
      {isAvailable ? props.text ?? t("text") : t("comingSoon")}
    </LoadingButton>
  );
}
