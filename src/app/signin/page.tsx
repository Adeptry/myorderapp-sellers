"use client";

import { routes } from "@/app/routes";
import { SignInForm } from "@/components/forms/SignInForm";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunctionNP } from "@/components/networking/useNetworkingFunctionNP";
import { useNetworkingFunctionP } from "@/components/networking/useNetworkingFunctionP";
import { Box, Grid, Skeleton, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { push } = useRouter();
  const { merchants, session, configs } = useNetworkingContext();
  const [getCurrentMerchantState, getCurrentMerchantFn] =
    useNetworkingFunctionNP(merchants.getCurrentMerchant.bind(merchants), true);
  const [getConfigState, getConfig] = useNetworkingFunctionP(
    configs.getConfig.bind(configs),
    false
  );

  useEffect(() => {
    async function fetch() {
      try {
        const response = await getCurrentMerchantFn({});
        if (response.data) {
          push(routes.catalog);
        }
      } catch (error) {}
    }

    fetch();
  }, []);

  const preloading =
    getCurrentMerchantState.loading ||
    getConfigState.loading ||
    session != null;

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={6}>
        <Box display="flex" justifyContent="center">
          {preloading ? (
            <Skeleton component={"h4"} width={"50px"} sx={{ py: 3 }} />
          ) : (
            <Typography component="h1" variant="h4" py={3}>
              Sign in
            </Typography>
          )}
        </Box>

        <SignInForm
          onSuccess={async (data) => {
            const merchantResponse = await getCurrentMerchantFn({
              headers: { Authorization: `Bearer ${data.token}` },
            });

            try {
              await getConfig(
                { actingAs: "merchant" },
                { headers: { Authorization: `Bearer ${data.token}` } }
              );
            } catch (error) {
              if (axios.isAxiosError(error) && error.response?.status === 404) {
                push(routes.onboarding.configurator);
                return;
              }
            }

            if (!merchantResponse.data.squareId) {
              push(routes.onboarding.square.index);
              return;
            }

            if (!merchantResponse.data.stripeCheckoutSessionId) {
              push(routes.onboarding.stripe.index);
              return;
            }

            push(routes.catalog);
          }}
          preloading={preloading}
        />
      </Grid>
    </Grid>
  );
}
