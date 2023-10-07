"use client";

import { MyOrderAppPreview } from "@/components/app-preview/MyOrderAppPreview";
import { AppConfigForm } from "@/components/forms/AppConfigForm";
import { TabLayout } from "@/components/layouts/TabLayout";
import { moaEnv } from "@/moaEnv";
import { useRedirectNotSetupSessions } from "@/routing/useRedirectNotSetupSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";
import { AppConfigEntity } from "myorderapp-square";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

export function AppConfigComponent() {
  useRedirectNotSetupSessions();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(780));
  const [appConfigState, setAppConfigState] = useState<
    AppConfigEntity | undefined
  >(undefined);
  const locale = useLocale();
  const maxHeightCssString = useMaxHeightCssString();
  const { data } = useSession();
  const t = useTranslations("AppConfigComponent");

  return (
    <Container sx={{ minHeight: maxHeightCssString }}>
      <TabLayout
        tabLabels={[t("formTabLabel"), t("previewTabLabel")]}
        sx={{ pt: isSmallScreen ? 0 : 3, pb: 3 }}
      >
        <AppConfigForm key="app-config-form" onChange={setAppConfigState} />
        <MyOrderAppPreview
          key="myorderapp-preview"
          sx={{ pb: 2 }}
          appConfig={appConfigState}
          authentication={data?.user}
          environment={{
            apiBaseUrl: moaEnv.backendUrl,
            apiKey: moaEnv.backendApiKey,
            isPreview: true,
            languageCodeOverride: locale,
          }}
        />
      </TabLayout>
    </Container>
  );
}
