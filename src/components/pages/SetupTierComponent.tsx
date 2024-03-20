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

import { routes } from "@/app/routes";
import { FaqAccordion } from "@/components/accordions/FaqAccordion";
import { PriceGrid } from "@/components/grids/PriceGrid";
import { OnboardingStepper } from "@/components/steppers/OnboardingStepper";
import { useRedirectSetupSessions } from "@/routing/useRedirectSetupSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Container, Stack } from "@mui/material";

export function SetupTierComponent() {
  useRedirectSetupSessions(routes.dashboard);
  const maxHeightCssString = useMaxHeightCssString();

  return (
    <Container sx={{ minHeight: maxHeightCssString }}>
      <Stack spacing={2} justifyContent="center" alignItems="center" py={2}>
        <OnboardingStepper step="checkout" sx={{ width: "100%" }} />
        <PriceGrid />

        <FaqAccordion sx={{ pl: 1 }} />
      </Stack>
    </Container>
  );
}
