"use client";

import { routes } from "@/app/routes";
import { SignInForm } from "@/components/forms/SignInForm";
import { useCurrentMerchantQuery } from "@/contexts/networking/useCurrentMerchantQuery";
import { Box, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { push } = useRouter();
  const getCurrentMerchantQueryState = useCurrentMerchantQuery();

  useEffect(() => {
    if (getCurrentMerchantQueryState.data) {
      push(routes.catalog);
    }
  }, [getCurrentMerchantQueryState.data]);

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={6}>
        <Box display="flex" justifyContent="center">
          <Typography component="h1" variant="h4" py={3}>
            Sign in
          </Typography>
        </Box>

        <SignInForm
          onSuccess={async (data) => {
            // const merchantResponse = await getCurrentMerchantFn({
            //   headers: { Authorization: `Bearer ${data.token}` },
            // });

            // try {
            //   await getConfig(
            //     { actingAs: "merchant" },
            //     { headers: { Authorization: `Bearer ${data.token}` } }
            //   );
            // } catch (error) {
            //   if (axios.isAxiosError(error) && error.response?.status === 404) {
            //     push(routes.onboarding.configurator);
            //     return;
            //   }
            // }

            // if (!merchantResponse.data.squareId) {
            //   push(routes.onboarding.square.index);
            //   return;
            // }

            // if (!merchantResponse.data.stripeCheckoutSessionId) {
            //   push(routes.onboarding.stripe.index);
            //   return;
            // }

            push(routes.catalog);
          }}
          preloading={false}
        />
      </Grid>
    </Grid>
  );
}
