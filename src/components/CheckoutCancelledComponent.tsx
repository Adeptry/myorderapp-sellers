"use client";

import { FaqAccordion } from "@/components/accordions/CheckoutFaqAccordion";
import { StripeCheckoutCancelledCard } from "@/components/cards/StripeCheckoutCancelledCard";
import { PriceGrid } from "@/components/grids/PriceGrid";
import { OnboardingStepper } from "@/components/steppers/OnboardingStepper";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Container, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";

export function CheckoutCancelledComponent() {
  useRedirectUnauthenticatedSessions();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const maxHeightCssString = useMaxHeightCssString();

  return (
    <Container sx={{ minHeight: maxHeightCssString, py: 2 }}>
      <Stack gap={2} alignItems={"center"}>
        <OnboardingStepper
          step="checkout"
          sx={{
            width: "100%",
          }}
        />
        <StripeCheckoutCancelledCard
          sx={{
            maxWidth: "sm",
          }}
        />
        <FaqAccordion sx={{ maxWidth: "sm", py: isSmallScreen ? 0 : 3 }} />
        <PriceGrid />
      </Stack>
    </Container>
  );
}
