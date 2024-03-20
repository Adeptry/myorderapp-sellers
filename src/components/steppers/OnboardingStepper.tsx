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

import { routes } from "@/app/routes";
import {
  Step,
  StepButton,
  StepLabel,
  Stepper,
  SxProps,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";

export type OnboardingStepType = "signUp" | "configure" | "square" | "checkout";

export const steps: OnboardingStepType[] = [
  "signUp",
  "configure",
  "square",
  "checkout",
];

export function OnboardingStepper(props: {
  step: OnboardingStepType;
  sx?: SxProps;
}) {
  const stepIndex = steps.indexOf(props.step);
  const { push } = useRouter();
  const theme = useTheme();
  const matchesXS = useMediaQuery(theme.breakpoints.down("sm"));
  const t = useTranslations("OnboardingStepper");

  function getTitleForStep(step: OnboardingStepType): string {
    switch (step) {
      case "signUp":
        return t("register");
      case "configure":
        return t("customize");
      case "square":
        return t("synchronize");
      case "checkout":
        return t("publish");
      default:
        throw new Error(`Unknown step: ${step}`);
    }
  }

  function getRouteForStep(step: OnboardingStepType): string | null {
    switch (step) {
      case "signUp":
        return null;
      case "configure":
        return routes.setup.theme;
      case "square":
        return routes.setup.catalog;
      case "checkout":
        return null;
      default:
        throw new Error(`Unknown step: ${step}`);
    }
  }

  return (
    <Stepper activeStep={stepIndex} sx={props.sx}>
      {steps.map((step: OnboardingStepType, index) => {
        const stepContent = (
          <Typography
            variant="body2"
            display={matchesXS && !(index === stepIndex) ? "none" : "block"}
          >
            {getTitleForStep(step)}
          </Typography>
        );

        const routeForStep = getRouteForStep(step);

        return (
          <Step key={getTitleForStep(step)}>
            {index < stepIndex && routeForStep ? (
              <StepButton
                color="inherit"
                onClick={() => {
                  push(routeForStep);
                }}
              >
                {stepContent}
              </StepButton>
            ) : (
              <StepLabel>{stepContent}</StepLabel>
            )}
          </Step>
        );
      })}
    </Stepper>
  );
}
