"use client";

import { routes } from "@/app/routes";
import { MyOrderAppPreview } from "@/components/app-preview/MyOrderAppPreview";
import { AppConfigForm } from "@/components/forms/AppConfigForm";
import { TabLayout } from "@/components/layouts/TabLayout";
import { OnboardingStepper } from "@/components/steppers/OnboardingStepper";
import { moaEnv } from "@/moaEnv";
import { useRedirectSetupSessions } from "@/routing/useRedirectSetupSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Container, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";
import { AppConfigEntity, CategoryEntity } from "myorderapp-square";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import categoriesJson from "../../utils/categories.json";
import { SetupAppConfigDialog } from "../dialogs/SetupAppConfigDialog";

export function SetupAppConfigComponent() {
  useRedirectSetupSessions(routes.theme);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(780));
  const [appConfigState, setAppConfigState] = useState<
    AppConfigEntity | undefined
  >(undefined);
  const t = useTranslations("SetupAppConfigComponent");
  const maxHeightCssString = useMaxHeightCssString();
  const locale = useLocale();

  const { data: sessionData } = useSession();
  const [showDialogState, setShowDialogState] = useState<boolean>(true);

  const categories: CategoryEntity[] = categoriesJson as CategoryEntity[];

  return (
    <Container sx={{ minHeight: maxHeightCssString }}>
      <Stack spacing={2} py={2}>
        <OnboardingStepper step="configure" sx={{ width: "100%" }} />
        <TabLayout
          tabLabels={[t("formTabLabel"), t("previewTabLabel")]}
          sx={{ pt: isSmallScreen ? 0 : 3, pb: 3 }}
        >
          <AppConfigForm
            key="app-config-form"
            autoFocus={true}
            buttonOnTop={true}
            successUrl={routes.setup.square.index}
            onChange={(appConfig) => {
              setAppConfigState(appConfig);
            }}
          />
          <MyOrderAppPreview
            key="myorderapp-preview"
            sx={{
              py: 2,
              position: "sticky",
              top: "72px", // Adjusted for the toolbar
            }}
            categories={categories}
            authentication={sessionData?.user}
            appConfig={appConfigState}
            environment={{
              apiBaseUrl: moaEnv.backendUrl,
              apiKey: moaEnv.backendApiKey,
              isPreview: true,
              languageCodeOverride: locale,
            }}
          />
        </TabLayout>
      </Stack>
      <SetupAppConfigDialog
        open={showDialogState}
        onClose={() => setShowDialogState(false)}
      />
    </Container>
  );
}
