"use client";

import { MyOrderAppPreview } from "@/components/app-preview/MyOrderAppPreview";
import { AppConfigForm } from "@/components/forms/AppConfigForm";
import { TabLayout } from "@/components/layouts/TabLayout";
import { useCurrentMerchantQuery } from "@/queries/useCurrentMerchantQuery";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { moaEnv } from "@/utils/moaEnv";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { AppConfig } from "moa-merchants-ts-axios";
import { useLocale } from "next-intl";
import { useState } from "react";

export default function Page() {
  useRedirectUnauthenticatedSessions();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(780));
  const [appConfigState, setAppConfigState] = useState<AppConfig | undefined>(
    undefined
  );
  const { data } = useCurrentMerchantQuery();
  const locale = useLocale();

  return (
    <Stack spacing={2}>
      <TabLayout
        tabLabels={["Options", "Preview"]}
        sx={{ pt: isSmallScreen ? 0 : 3, pb: 3 }}
      >
        <AppConfigForm key="app-config-form" onChange={setAppConfigState} />
        <MyOrderAppPreview
          key="myorderapp-preview"
          sx={{ pb: 2 }}
          appConfig={appConfigState}
          environment={{
            apiBaseUrl: moaEnv.backendUrl,
            apiKey: moaEnv.backendApiKey,
            merchantFrontendUrl: moaEnv.frontendUrl,
            merchantId: data?.id ?? null,
            isPreview: true,
            languageCodeOverride: locale,
          }}
        />
      </TabLayout>
    </Stack>
  );
}
