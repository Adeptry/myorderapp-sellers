"use client";

import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import ConfirmSquareOauthComponent from "@/components/utils/ConfirmSquareOauthComponent";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Stack } from "@mui/material";
import { Suspense } from "react";

export default function Page() {
  useRedirectUnauthenticatedSessions();
  const maxHeightCssString = useMaxHeightCssString();

  return (
    <Stack height={maxHeightCssString}>
      <OnboardingStepper
        activeStep={OnboardingSteps.square}
        sx={{ width: "100%", py: 2 }}
      />
      <Suspense>
        <ConfirmSquareOauthComponent />
      </Suspense>
    </Stack>
  );
}
