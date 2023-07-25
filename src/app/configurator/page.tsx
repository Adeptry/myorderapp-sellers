"use client";

import { Configurator } from "@/components/Configurator";
import OnboardingStepper, {
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunction } from "@/components/networking/useNetworkingFunction";
import { Alert, Container, Snackbar, Stack } from "@mui/material";
import axios from "axios";
import { ConfigUpdateDto } from "moa-merchants-ts-axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { routes } from "../routes";

export default function Page() {
  const { configs } = useNetworkingContext();
  const { push } = useRouter();
  const [{ data, loading, error }, invoke] = useNetworkingFunction(
    configs.getConfig.bind(configs),
    true
  );
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    async function fetch() {
      try {
        await invoke({ actingAs: "merchant" });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status == 401) {
          push("/signin");
          return;
        }
      }
    }

    fetch();
  }, []);

  const isOnboarding = data == null;
  const submitText = isOnboarding ? "Create your app" : "Update your app";

  return (
    <>
      <Container maxWidth="md">
        <Stack spacing={3}>
          {isOnboarding && (
            <OnboardingStepper activeStep={OnboardingSteps.configure} />
          )}
          <Configurator
            onSuccess={() => {
              if (isOnboarding) {
                push(routes.square);
              } else {
                handleClick();
              }
            }}
            submitText={submitText}
            preloading={loading}
            shouldAutoFocus={data == null}
            defaultValues={data as ConfigUpdateDto}
          />
        </Stack>
      </Container>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          App updated! It will take some time to propogate to all devices.
        </Alert>
      </Snackbar>
    </>
  );
}
