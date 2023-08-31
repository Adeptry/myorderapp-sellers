"use client";

import { routes } from "@/app/routes";
import { MyOrderAppPreview } from "@/components/app-preview/MyOrderAppPreview";
import { AppConfigForm } from "@/components/forms/AppConfigForm";
import { TabLayout } from "@/components/layouts/TabLayout";
import { moaEnv } from "@/utils/config";
import { useCurrentMerchantQuery } from "@/utils/useCurrentMerchantQuery";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { AppConfig } from "moa-merchants-ts-axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import { useEffect, useState } from "react";

export default function Page() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(780));
  const [appConfigState, setAppConfigState] = useState<AppConfig | undefined>(
    undefined
  );
  const { data } = useCurrentMerchantQuery();
  const { push } = useRouter();
  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      push(routes.login);
    }
  }, [status]);
  return (
    <Stack spacing={2}>
      <TabLayout
        tabLabels={["Options", "Preview"]}
        sx={{ pt: isSmallScreen ? 0 : 3, pb: 3 }}
      >
        <AppConfigForm
          key="app-config-form"
          onChange={(appConfig) => {
            setAppConfigState(appConfig);
          }}
        />
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
          }}
        />
      </TabLayout>
    </Stack>
  );
}
