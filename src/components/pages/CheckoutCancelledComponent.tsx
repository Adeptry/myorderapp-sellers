/*
    This code is part of the myorderapp-sellers front-end.
    Copyright (C) 2024  Adeptry, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

"use client";

import { FaqAccordion } from "@/components/accordions/FaqAccordion";
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
