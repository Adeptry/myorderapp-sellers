"use client";

import { routes } from "@/app/routes";
import { MyOrderAppPreview } from "@/components/MyOrderAppPreview";
import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { AppConfigForm } from "@/components/forms/AppConfigForm";
import { TabLayout } from "@/components/layouts/TabLayout";
import { logger } from "@/utils/logger";
import { useCurrentMerchantQuery } from "@/utils/useCurrentMerchantQuery";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { AppConfig } from "moa-merchants-ts-axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  logger.info({}, "Rendering /onboarding/configure/page.tsx");
  const { push } = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(780));
  const [appConfigState, setAppConfigState] = useState<AppConfig | undefined>(
    undefined
  );
  const { data: currentMerchantData } = useCurrentMerchantQuery();

  return (
    <Stack spacing={2} py={2}>
      <OnboardingStepper
        activeStep={OnboardingSteps.configure}
        sx={{ width: "100%" }}
      />
      <TabLayout
        tabLabels={["Options", "Preview"]}
        sx={{ pt: isSmallScreen ? 0 : 3, pb: 3 }}
      >
        <AppConfigForm
          key="app-config-form"
          onSuccess={() => {
            push(routes.onboarding.square.index);
          }}
          onChange={(appConfig) => {
            setAppConfigState(appConfig);
          }}
        />
        <MyOrderAppPreview
          key="myorderapp-preview"
          sx={{ pb: 2 }}
          theme={{
            name: appConfigState?.name ?? null,
            seedColor: appConfigState?.seedColor ?? null,
            fontFamily: appConfigState?.fontFamily ?? null,
            useMaterial3: appConfigState?.useMaterial3 ?? null,
            themeMode: appConfigState?.themeMode ?? null,
          }}
          environment={{
            apiBaseUrl: process.env.NEXT_PUBLIC_BACKEND_DOMAIN!,
            apiKey: process.env.NEXT_PUBLIC_BACKEND_API_KEY!,
            merchantFrontendUrl: process.env.NEXT_PUBLIC_FRONTEND_DOMAIN!,
            merchantId: currentMerchantData?.id ?? null,
            isPreview: true,
          }}
        />
      </TabLayout>
    </Stack>
  );
}
