"use client";

import { Configurator } from "@/components/Configurator";
import { SignUpLayout } from "@/components/layouts/SignUpLayout";
import SquareOauthButton from "@/components/SquareOauthButton";
import { mapEnum } from "@/utils/mapEnum";
import { Box, Button, Container } from "@mui/material";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Stepper from "@mui/material/Stepper";
import Grid from "@mui/material/Unstable_Grid2";
import { Merchant } from "moa-merchants-ts-axios";
import * as React from "react";
import { useState } from "react";

enum Steps {
  signUp = 0,
  configure,
  square,
  checkout,
}

const StepsTitles: { [key in Steps]: string } = {
  [Steps.signUp]: "Sign Up",
  [Steps.configure]: "Create your App",
  [Steps.square]: "Sync your Catalog",
  [Steps.checkout]: "Subscribe to Publish",
};

export default function Page() {
  const [activeStepState, setActiveStepState] = useState(Steps.signUp);
  const [completedState, setCompletedState] = useState<Record<Steps, boolean>>({
    [Steps.signUp]: false,
    [Steps.configure]: false,
    [Steps.square]: false,
    [Steps.checkout]: false,
  });
  const [merchantState, setMerchantState] = useState<Merchant | undefined>(
    undefined
  );

  const totalSteps = () => {
    return Object.keys(Steps).length / 2;
  };

  const completedSteps = () => {
    return Object.keys(completedState).length;
  };

  const isLastStep = () => {
    return activeStepState === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    setActiveStepState(activeStepState + 1);
  };

  const handleBack = () => {
    setActiveStepState((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    if (step === Steps.signUp) {
      return;
    }
    setActiveStepState(step);
  };

  return (
    <Container>
      <Box pb={3}>
        <Stepper nonLinear activeStep={activeStepState}>
          {mapEnum(Steps, (step: Steps) => {
            return (
              <Step key={step} completed={completedState[step]}>
                <StepButton color="inherit" onClick={() => handleStep(step)}>
                  {StepsTitles[step]}
                </StepButton>
              </Step>
            );
          })}
        </Stepper>
      </Box>

      <div>
        {activeStepState === Steps.signUp && (
          <Grid container mt={3}>
            <Grid sm={8} smOffset={2} md={6} mdOffset={3} lg={4} lgOffset={4}>
              <SignUpLayout
                onSuccess={function (merchant: Merchant): void {
                  setMerchantState(merchant);
                  handleNext();
                }}
              />
            </Grid>
          </Grid>
        )}
        {activeStepState === Steps.configure && (
          <Container disableGutters>
            <Configurator
              autoFocus={true}
              onSuccess={() => {
                handleNext();
              }}
            />
          </Container>
        )}
        {activeStepState === Steps.square && (
          <Container sx={{ marginTop: 3 }} disableGutters>
            <SquareOauthButton state={merchantState?.id ?? ""} />
          </Container>
        )}
        {!allStepsCompleted() && (
          <React.Fragment>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              {activeStepState > 1 && (
                <Button
                  color="inherit"
                  disabled={activeStepState === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
              )}
              <Box sx={{ flex: "1 1 auto" }} />
              {activeStepState > 0 && (
                <Button onClick={handleNext} sx={{ mr: 1 }}>
                  Next
                </Button>
              )}
            </Box>
          </React.Fragment>
        )}
      </div>
    </Container>
  );
}
