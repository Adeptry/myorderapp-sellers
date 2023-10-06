"use client";

import { CatalogAccordion } from "@/components/accordions/CatalogAccordion";
import { MyOrderAppPreview } from "@/components/app-preview/MyOrderAppPreview";
import { TabLayout } from "@/components/layouts/TabLayout";
import { moaEnv } from "@/moaEnv";
import { useGetCategoriesMeQuery } from "@/networking/queries/useGetCategoriesMeQuery";
import { useRedirectSetupSessions } from "@/routing/useRedirectSetupSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";

export function CatalogComponent() {
  useRedirectSetupSessions();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(780));
  const maxHeightCssString = useMaxHeightCssString();
  const t = useTranslations("CatalogComponent");

  const currentCatalogQuery = useGetCategoriesMeQuery();
  const currentCatalogCategories = currentCatalogQuery.data?.data ?? [];
  const locale = useLocale();
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
          environment={{
            apiBaseUrl: moaEnv.backendUrl!,
            apiKey: moaEnv.backendApiKey!,

            isPreview: true,
            languageCodeOverride: locale,
          }}
        />
      </TabLayout>
    </Container>
  );
}
