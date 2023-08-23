"use client";

import { routes } from "@/app/routes";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { CheckCircleOutline } from "@mui/icons-material";
import { Box, Button, Skeleton, Stack, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MerchantsApiFp, StripeCheckoutDto } from "moa-merchants-ts-axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect } from "react";

export default function Page() {
  const { push, refresh } = useRouter();
  const searchParams = useSearchParams();
  const checkoutSessionId = searchParams.get("session_id");
  const queryClient = useQueryClient();

  const { configuration, preloading } = useSessionedApiConfiguration();

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
      if (checkoutSessionId && !preloading) {
        confirmStripeCheckoutMutation.mutateAsync({
          checkoutSessionId: checkoutSessionId,
        });
      }
    }

    fetch();
  }, [checkoutSessionId, preloading]);

  const loading =
    confirmStripeCheckoutMutation.isLoading ||
    preloading ||
    checkoutSessionId === null;

  return (
    <Stack py={2} spacing={2} display="flex" alignItems="center">
      {loading && (
        <Box justifyContent={"center"} display="flex">
          <Skeleton variant="rectangular" width={210} height={118} />
        </Box>
      )}

      {!loading && (
        <Fragment>
          <CheckCircleOutline style={{ fontSize: 60, color: green[500] }} />
          <Typography variant="h5" align="center" gutterBottom>
            Congratulations, your purchase was successful!
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            No further action is necessary. You may continue to edit your
            application and catalog at your convenience.
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            We will be in touch within 1 business day.
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => {
                push(routes.catalog);
                refresh();
              }}
            >
              Go to Catalog
            </Button>
          </Box>
        </Fragment>
      )}
    </Stack>
  );
}
