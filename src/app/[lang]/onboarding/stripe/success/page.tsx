"use client";

import { StripeCheckoutSuccessCard } from "@/components/cards/StripeCheckoutSuccessCard";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MerchantsApiFp, StripeCheckoutDto } from "moa-merchants-ts-axios";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const checkoutSessionId = searchParams.get("session_id");
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const { configuration, status } = useSessionedApiConfiguration();

  const confirmStripeCheckoutMutation = useMutation({
    mutationFn: async (stripeCheckoutDto: StripeCheckoutDto) => {
      return (
        await (
          await MerchantsApiFp(configuration).confirmStripeCheckout(
            stripeCheckoutDto
          )
        )()
      ).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["getCurrentMerchant"]);
    },
  });

  useEffect(() => {
    async function fetch() {
      if (checkoutSessionId && status === "authenticated") {
        confirmStripeCheckoutMutation.mutateAsync({
          checkoutSessionId: checkoutSessionId,
        });
      }
    }

    fetch();
  }, [checkoutSessionId, status]);

  const loading =
    confirmStripeCheckoutMutation.isLoading ||
    status === "loading" ||
    checkoutSessionId === null;

  return (
    <Stack spacing={2} display="flex" alignItems="center">
      <StripeCheckoutSuccessCard sx={{ maxWidth: "sm" }} />
    </Stack>
  );
}
