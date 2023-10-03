"use client";

import { ConfirmSquareOauthComponent } from "@/components/ConfirmSquareOauthComponent";
import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Container, Stack } from "@mui/material";
import { Suspense } from "react";

export default function Page() {
  useRedirectUnauthenticatedSessions();
  const maxHeightCssString = useMaxHeightCssString();

  return (
    <Container sx={{ minHeight: maxHeightCssString }}>
      <Stack height={maxHeightCssString}>
        <OnboardingStepper
          activeStep={OnboardingSteps.square}
          sx={{ width: "100%", py: 2 }}
        />
        <Suspense>
          <ConfirmSquareOauthComponent />
        </Suspense>
      </Stack>
    </Container>
  );
}
