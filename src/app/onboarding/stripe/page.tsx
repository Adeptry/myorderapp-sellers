"use client";

import { routes } from "@/app/routes";
import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { moaEnv } from "@/utils/config";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { ShoppingCartCheckout } from "@mui/icons-material";
import AppsIcon from "@mui/icons-material/Apps";
import MobileFriendlyIcon from "@mui/icons-material/MobileFriendly";
import PaletteIcon from "@mui/icons-material/Palette";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import UpdateIcon from "@mui/icons-material/Update";
import { LoadingButton } from "@mui/lab";
import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MerchantsApiFp } from "moa-merchants-ts-axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { push } = useRouter();
  const { configuration, status } = useSessionedApiConfiguration();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (status === "unauthenticated") {
      push(routes.signin);
    }
  }, [status]);
  const createStripeCheckoutQuery = useQuery({
    queryKey: ["createStripeCheckout"],
    queryFn: async () => {
      return (
        await (
          await MerchantsApiFp(configuration).createStripeCheckout({
            successUrl: `${moaEnv.frontendUrl}${routes.onboarding.stripe.success}`,
            cancelUrl: `${moaEnv.frontendUrl}${routes.onboarding.stripe.cancel}`,
          })
        )()
      ).data;
    },
    enabled: status === "authenticated",
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
    <Stack py={2} spacing={2}>
      <OnboardingStepper
        activeStep={OnboardingSteps.checkout}
        sx={{ width: "100%", pt: isSmallScreen ? 0 : 2 }}
      />
      <Stack spacing={2} p={2} textAlign="center" alignItems={"center"}>
        <Typography variant="h4">
          You're One Step Away From Going Live!
        </Typography>
        <Typography variant="body1">
          Join our growing community of vendors enjoying a seamless experience
          publishing iOS and Android apps. Here's what you get for $99 per
          month:
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemIcon>
              <MobileFriendlyIcon />
            </ListItemIcon>
            <ListItemText primary="Hassle-free app publishing on iOS and Android platforms" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <AppsIcon />
            </ListItemIcon>
            <ListItemText primary="Comprehensive app management features" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <PaletteIcon />
            </ListItemIcon>
            <ListItemText primary="Customizable app and catalog features to cater to your specific needs" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <SupportAgentIcon />
            </ListItemIcon>
            <ListItemText primary="Outstanding customer support and app maintenance" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <UpdateIcon />
            </ListItemIcon>
            <ListItemText primary="Frequent app updates to keep your business on the cutting edge" />
          </ListItem>
        </List>
        <Typography variant="body1">
          Click the button below to proceed to our secure checkout. Your journey
          to reaching a wider audience starts here!
        </Typography>
        <Box>
          <LoadingButton
            variant="contained"
            color="secondary"
            size="large"
            onClick={onClickCheckout}
            startIcon={<ShoppingCartCheckout />}
            loading={buttonLoading}
            disabled={buttonLoading}
          >
            Proceed to Checkout
          </LoadingButton>
        </Box>
      </Stack>
    </Stack>
  );
}
