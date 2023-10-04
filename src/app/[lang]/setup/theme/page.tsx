"use client";

import { routes } from "@/app/routes";
import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { MyOrderAppPreview } from "@/components/app-preview/MyOrderAppPreview";
import { AppConfigForm } from "@/components/forms/AppConfigForm";
import { TabLayout } from "@/components/layouts/TabLayout";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { moaEnv } from "@/utils/moaEnv";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Container, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";
import { AppConfigEntity } from "myorderapp-square";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useEffect, useState } from "react";

export default function Page() {
  useRedirectUnauthenticatedSessions();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(780));
  const [appConfigState, setAppConfigState] = useState<
    AppConfigEntity | undefined
  >(undefined);
  const common = useTranslations("Common");
  const maxHeightCssString = useMaxHeightCssString();

  const { push } = useRouter();
  const { status, data } = useSession();
  const locale = useLocale();
  useEffect(() => {
    if (status === "unauthenticated") {
      push(routes.login);
    }
  }, [status]);

  return (
    <Container sx={{ minHeight: maxHeightCssString }}>
      <Stack spacing={2} py={2}>
        <OnboardingStepper
          activeStep={OnboardingSteps.configure}
          sx={{ width: "100%" }}
        />
        <TabLayout
          tabLabels={[common("options"), common("preview")]}
          sx={{ pt: isSmallScreen ? 0 : 3, pb: 3 }}
        >
          <AppConfigForm
            key="app-config-form"
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
            authentication={data?.user}
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
    </Container>
  );
}
