"use client";

import { routes } from "@/app/routes";
import DevicePreview from "@/components/DevicePreview";
import OnboardingStepper, {
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { AppConfigForm } from "@/components/forms/AppConfigForm";
import { TabLayout } from "@/components/layouts/TabLayout";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunction } from "@/components/networking/useNetworkingFunction";
import {
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { AppConfigUpdateDto } from "moa-merchants-ts-axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Page() {
  const { push } = useRouter();
  const { configs } = useNetworkingContext();
  const [{ data, loading }, getConfig] = useNetworkingFunction(
    configs.getConfig.bind(configs),
    true
  );
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(780));

  useEffect(() => {
    async function fetch() {
      try {
        await getConfig({ actingAs: "merchant" });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status == 401) {
          push(routes.signin);
          return;
        }
      }
    }

    fetch();
  }, []);

  const preloading = loading;

  return (
    <Stack spacing={3} py={3}>
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
      <TabLayout
        tabLabels={["Options", "Preview"]}
        sx={{ pt: isSmallScreen ? 0 : 3 }}
      >
        <Stack spacing={2} sx={{ width: "100%" }}>
          <AppConfigForm
            key="app-config-form"
            onChange={(field, value) => {
              iframeRef.current?.contentWindow?.postMessage(
                { [field]: value },
                "*"
              );
            }}
            preloading={preloading}
            submitText={"Create your app"}
            onSuccess={() => {
              push(routes.onboarding.square);
            }}
            shouldAutoFocus={data == null}
            defaultValues={data as AppConfigUpdateDto}
          />
          {loading ? (
            <>
              <Skeleton variant="text" sx={{ width: "100%" }} />
            </>
          ) : (
            <Typography variant="body1" textAlign={"center"}>
              In the next step, we'll request authorization to connect with your
              Square account to sync your catalog to your app.
            </Typography>
          )}
        </Stack>
        {preloading ? (
          <Skeleton height="512px" width="100%" key="device-preview-skeleton" />
        ) : (
          <DevicePreview iframeRef={iframeRef} key="device-preview" />
        )}
      </TabLayout>
    </Stack>
  );
}
