import { mapEnum } from "@/utils/mapEnum";
import { SxProps } from "@mui/material";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";

export enum OnboardingSteps {
  signUp = 0,
  configure,
  square,
  checkout,
}

const OnboardingStepsTitles: { [key in OnboardingSteps]: string } = {
  [OnboardingSteps.signUp]: "Sign Up",
  [OnboardingSteps.configure]: "Create your App",
  [OnboardingSteps.square]: "Sync your Catalog",
  [OnboardingSteps.checkout]: "Subscribe to Publish",
};
export default function HorizontalLinearStepper(props: {
  activeStep: OnboardingSteps;
  sx?: SxProps;
}) {
  const { activeStep } = props;
  return (
    <Stepper activeStep={activeStep} sx={props.sx}>
      {mapEnum(OnboardingSteps, (step: OnboardingSteps) => {
        return (
          <Step key={OnboardingStepsTitles[step]}>
            <StepLabel>{OnboardingStepsTitles[step]}</StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
}
