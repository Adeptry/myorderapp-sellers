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

import { CatalogAccordion } from "@/components/accordions/CatalogAccordion";
import { MyOrderAppPreview } from "@/components/app-preview/MyOrderAppPreview";
import { TabLayout } from "@/components/layouts/TabLayout";
import { useGetAppConfigMeQuery } from "@/networking/queries/useGetAppConfigMeQuery";
import { useGetCategoriesMeQuery } from "@/networking/queries/useGetCategoriesMeQuery";
import { useRedirectNotSetupSessions } from "@/routing/useRedirectNotSetupSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export function CatalogComponent() {
  useRedirectNotSetupSessions();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(780));
  const maxHeightCssString = useMaxHeightCssString();
  const t = useTranslations("CatalogComponent");

  const currentCatalogQuery = useGetCategoriesMeQuery();
  const currentCatalogCategories = currentCatalogQuery.data?.data ?? [];
  const { data: appConfig } = useGetAppConfigMeQuery();

  const { data } = useSession();
  return (
    <Container sx={{ minHeight: maxHeightCssString }}>
      <TabLayout
        tabLabels={[t("catalogTabLabel"), t("previewTabLabel")]}
        sx={{ pt: isSmallScreen ? 0 : 3, pb: 3 }}
      >
        <CatalogAccordion />
        <MyOrderAppPreview
          key="device-preview"
          sx={{ pb: 2, position: "sticky", top: "72px" }}
          categories={currentCatalogCategories}
          authentication={data?.user}
          appConfig={{ ...appConfig, useAdaptiveScaffold: false }}
        />
      </TabLayout>
    </Container>
  );
}
