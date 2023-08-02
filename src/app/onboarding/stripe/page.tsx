"use client";

import { routes } from "@/app/routes";
import OnboardingStepper, {
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunctionP } from "@/components/networking/useNetworkingFunctionP";
import { Check, ShoppingCartCheckout } from "@mui/icons-material";
import AppsIcon from "@mui/icons-material/Apps";
import MobileFriendlyIcon from "@mui/icons-material/MobileFriendly";
import PaletteIcon from "@mui/icons-material/Palette";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import UpdateIcon from "@mui/icons-material/Update";
import { LoadingButton } from "@mui/lab";
import { Box, Stack, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const { push } = useRouter();

  const { merchants } = useNetworkingContext();
  const [startStripeCheckoutState, startStripeCheckoutFn] =
    useNetworkingFunctionP(
      merchants.startStripeCheckout.bind(merchants),
      false
    );

  const [stripeLoading, setStripeLoading] = useState(false);
  const onClickCheckout = async () => {
    setStripeLoading(true);
    try {
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );
      const frontEndDomain = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN;
      const response = await startStripeCheckoutFn(
        {
          stripeCheckoutCreateDto: {
            successUrl: `${frontEndDomain}${routes.onboarding.stripe.success}`,
            cancelUrl: `${frontEndDomain}${routes.onboarding.stripe.cancel}`,
          },
        },
        {}
      );
      if (stripe && response.data.checkoutSessionId) {
        stripe.redirectToCheckout({
          sessionId: response.data.checkoutSessionId,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status == 401) {
        push(routes.signin);
        return;
      }
    } finally {
      setStripeLoading(false);
    }
  };

  if (startStripeCheckoutState.error) {
    return <div>Error: {JSON.stringify(startStripeCheckoutState.error)}</div>;
  }

  return (
    <Stack py={2} spacing={2}>
      <OnboardingStepper
        activeStep={OnboardingSteps.checkout}
        sx={{ width: "100%" }}
      />
      <Stack spacing={2} p={2} textAlign="center" alignItems={"center"}>
        <Typography variant="h4">
          You're One Step Away From Going Live!
        </Typography>
        <Typography variant="body1">
          Join our growing community of vendors enjoying a seamless experience
          publishing iOS and Android apps. Here's what you get for $100 per
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
            startIcon={
              startStripeCheckoutState.data ? (
                <Check />
              ) : (
                <ShoppingCartCheckout />
              )
            }
            loading={stripeLoading}
            disabled={(stripeLoading || startStripeCheckoutState.data) && true}
          >
            {startStripeCheckoutState.data ? "Ready!" : "Proceed to Checkout"}
          </LoadingButton>
        </Box>
      </Stack>
    </Stack>
  );
}
