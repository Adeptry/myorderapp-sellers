"use client";

import { routes } from "@/app/routes";
import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { AppConfigForm } from "@/components/forms/AppConfigForm";
import { useNetworkingContext } from "@/contexts/networking/useNetworkingContext";
import { Skeleton, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  AppConfigUpdateDto,
  ConfigsApiGetConfigRequest,
} from "moa-merchants-ts-axios";
import { useRouter } from "next/navigation";

export default function Page() {
  const { push } = useRouter();
  const { configs } = useNetworkingContext();
  const myConfigQuery = useQuery(
    ["myConfig", { actingAs: "merchant" }],
    (context) => {
      return configs.getConfig(
        context.queryKey[1] as ConfigsApiGetConfigRequest,
        {}
      );
    },
    {
      retry: 0,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  return (
    <Stack spacing={2} py={2}>
      {myConfigQuery.isLoading ? (
        <Skeleton height={"24px"} />
      ) : (
        <OnboardingStepper
          activeStep={OnboardingSteps.configure}
          sx={{ width: "100%" }}
        />
      )}
      {myConfigQuery.isLoading ? (
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
        preloading={myConfigQuery.isLoading}
        submitText={"Create your app"}
        onSuccess={() => {
          push(routes.onboarding.square.index);
        }}
        shouldAutoFocus={myConfigQuery.data == null}
        defaultValues={myConfigQuery.data as AppConfigUpdateDto}
      />
    </Stack>
  );
}
