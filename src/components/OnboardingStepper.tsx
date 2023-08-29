import { routes } from "@/app/routes";
import { mapNumberEnum } from "@/utils/mapNumberEnum";
import {
  StepButton,
  StepLabel,
  SxProps,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Step from "@mui/material/Step";
import Stepper from "@mui/material/Stepper";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";

export enum OnboardingSteps {
  signUp = 0,
  configure,
  square,
  checkout,
}

export function OnboardingStepper(props: {
  activeStep: OnboardingSteps;
  sx?: SxProps;
}) {
  const { activeStep } = props;
  const { push } = useRouter();
  const theme = useTheme();
  const matchesXS = useMediaQuery(theme.breakpoints.down("sm"));
  const t = useTranslations("OnboardingStepper");
  const common = useTranslations("common");

  function getTitleForStep(step: OnboardingSteps): string {
    switch (step) {
      case OnboardingSteps.signUp:
        return common("signUp");
      case OnboardingSteps.configure:
        return t("customize");
      case OnboardingSteps.square:
        return t("synchronize");
      case OnboardingSteps.checkout:
        return t("publish");
      default:
        throw new Error(`Unknown step: ${step}`);
    }
  }

  function getRouteForStep(step: OnboardingSteps): string | null {
    switch (step) {
      case OnboardingSteps.signUp:
        return null;
      case OnboardingSteps.configure:
        return routes.onboarding.appearance;
      case OnboardingSteps.square:
        return routes.onboarding.catalog;
      case OnboardingSteps.checkout:
        return null;
      default:
        throw new Error(`Unknown step: ${step}`);
    }
  }

  return (
    <Stepper activeStep={activeStep} sx={props.sx}>
      {mapNumberEnum(OnboardingSteps, (step: OnboardingSteps) => {
        const stepContent = (
          <Typography
            variant="body2"
            display={matchesXS && !(step === activeStep) ? "none" : "block"}
          >
            {getTitleForStep(step)}
          </Typography>
        );

        const routeForStep = getRouteForStep(step);

        return (
          <Step key={getTitleForStep(step)}>
            {step < activeStep && routeForStep ? (
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
