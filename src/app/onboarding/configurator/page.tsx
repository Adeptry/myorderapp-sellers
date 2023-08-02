"use client";

import { routes } from "@/app/routes";
import OnboardingStepper, {
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { AppConfigForm } from "@/components/forms/AppConfigForm";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunctionP } from "@/components/networking/useNetworkingFunctionP";
import { Skeleton, Stack, Typography } from "@mui/material";
import axios from "axios";
import { AppConfigUpdateDto } from "moa-merchants-ts-axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { push } = useRouter();
  const { configs } = useNetworkingContext();
  const [{ data, loading }, getConfig] = useNetworkingFunctionP(
    configs.getConfig.bind(configs),
    true
  );

  useEffect(() => {
    async function fetch() {
      try {
        await getConfig({ actingAs: "merchant" }, {});
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          push(routes.signin);
          return;
        }
      }
    }

    fetch();
  }, []);

  const preloading = loading;

  return (
    <Stack spacing={2} py={2}>
      {loading ? (
        <Skeleton height={"24px"} />
      ) : (
        <OnboardingStepper
          activeStep={OnboardingSteps.configure}
          sx={{ width: "100%" }}
        />
      )}
      {loading ? (
        <>
          <Skeleton variant="text" />
        </>
      ) : (
        <Typography variant="body1" textAlign={"center"}>
          Welcome to the app configurator! Personalize your app and view changes
          instantly. Unsure about colors or fonts? No worries,{" "}
          <strong>you can update those anytime</strong> and your changes will
          reflect immediately in-app, even after launch. And if you don't have
          an icon on hand, don't worry, we'll be in touch to help you create one
          totally free of charge.
        </Typography>
      )}

      <AppConfigForm
        key="app-config-form"
        preloading={preloading}
        submitText={"Create your app"}
        onSuccess={() => {
          push(routes.onboarding.square.index);
        }}
        shouldAutoFocus={data == null}
        defaultValues={data as AppConfigUpdateDto}
      />
    </Stack>
  );
}
