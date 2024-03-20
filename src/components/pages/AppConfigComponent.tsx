/*
    This code is part of the myorderapp-sellers front-end.
    Copyright (C) 2024  Adeptry, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

"use client";

import { MyOrderAppPreview } from "@/components/app-preview/MyOrderAppPreview";
import { AppConfigForm } from "@/components/forms/AppConfigForm";
import { TabLayout } from "@/components/layouts/TabLayout";
import { useRedirectNotSetupSessions } from "@/routing/useRedirectNotSetupSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";
import { AppConfigEntity } from "myorderapp-square";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function AppConfigComponent() {
  useRedirectNotSetupSessions();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(780));
  const [appConfigState, setAppConfigState] = useState<
    AppConfigEntity | undefined
  >(undefined);
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
        />
      </TabLayout>
    </Container>
  );
}
