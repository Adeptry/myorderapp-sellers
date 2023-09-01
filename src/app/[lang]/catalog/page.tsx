"use client";

import { routes } from "@/app/routes";
import { CatalogAccordion } from "@/components/accordions/CatalogAccordion";
import { MyOrderAppPreview } from "@/components/app-preview/MyOrderAppPreview";
import { TabLayout } from "@/components/layouts/TabLayout";
import { useCurrentCatalogQuery } from "@/queries/useCurrentCatalogQuery";
import { useCurrentMerchantQuery } from "@/queries/useCurrentMerchantQuery";
import { moaEnv } from "@/utils/config";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";

export default function Page() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(780));
  const { data: currentMerchantData } = useCurrentMerchantQuery();
  const currentCatalogQuery = useCurrentCatalogQuery();
  const currentCatalogCategories = currentCatalogQuery.data?.data ?? [];

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
            merchantFrontendUrl: moaEnv.frontendUrl!,
            merchantId: currentMerchantData?.id ?? null,
            isPreview: true,
          }}
        />
      </TabLayout>
    </Stack>
  );
}
