"use client";

import { routes } from "@/app/routes";
import { useNetworkingContext } from "@/contexts/networking/useNetworkingContext";
import { useNetworkingFunctionP } from "@/contexts/networking/useNetworkingFunctionP";
import { CheckCircleOutline } from "@mui/icons-material";
import { Alert, Box, Button, Skeleton, Stack, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

export default function Page() {
  const { push, refresh } = useRouter();
  const searchParams = useSearchParams();
  const checkoutSessionId = searchParams.get("session_id");

  const { merchants } = useNetworkingContext();
  const [confirmStripeCheckoutState, confirmStripeCheckoutFn] =
    useNetworkingFunctionP(
      merchants.confirmStripeCheckout.bind(merchants),
      true
    );

  const [errorString, setErrorString] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      if (checkoutSessionId) {
        try {
          await confirmStripeCheckoutFn(
            { stripeCheckoutDto: { checkoutSessionId } },
            {}
          );
        } catch (error) {
          if (axios.isAxiosError(error) && error?.response?.status === 422) {
            const message = (error?.response?.data as any).message;
            if (typeof message === "string") {
              setErrorString(message);
            } else {
              setErrorString("There was an error. Please try again.");
            }
          } else {
            setErrorString("There was an error. Please try again.");
          }
        }
      }
    }

    fetch();
  }, [checkoutSessionId]);

  return (
    <Stack py={2} spacing={2} display="flex" alignItems="center">
      {errorString && (
        <Box justifyContent={"center"} display="flex">
          <Alert severity="error">{errorString}</Alert>
        </Box>
      )}

      {confirmStripeCheckoutState.loading && (
        <Box justifyContent={"center"} display="flex">
          <Skeleton variant="rectangular" width={210} height={118} />
        </Box>
      )}

      {!errorString && !confirmStripeCheckoutState.loading && (
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
