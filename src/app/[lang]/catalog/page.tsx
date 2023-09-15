"use client";

import { CatalogAccordion } from "@/components/accordions/CatalogAccordion";
import { MyOrderAppPreview } from "@/components/app-preview/MyOrderAppPreview";
import { TabLayout } from "@/components/layouts/TabLayout";
import { useCurrentCatalogQuery } from "@/queries/useCurrentCatalogQuery";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { moaEnv } from "@/utils/moaEnv";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { useLocale } from "next-intl";

export default function Page() {
  useRedirectUnauthenticatedSessions();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(780));

  const currentCatalogQuery = useCurrentCatalogQuery();
  const currentCatalogCategories = currentCatalogQuery.data?.data ?? [];
  const locale = useLocale();

  return (
    <Stack spacing={2}>
      <TabLayout
        tabLabels={["Catalog", "Preview"]}
        sx={{ pt: isSmallScreen ? 0 : 3, pb: 3 }}
      >
        <CatalogAccordion />
        <MyOrderAppPreview
          key="device-preview"
          sx={{ pb: 2, position: "sticky", top: "72px" }}
          categories={currentCatalogCategories}
          environment={{
            apiBaseUrl: moaEnv.backendUrl!,
            apiKey: moaEnv.backendApiKey!,
            isPreview: true,
            languageCodeOverride: locale,
          }}
        />
      </TabLayout>
    </Stack>
  );
}
