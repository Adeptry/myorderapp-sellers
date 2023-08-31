"use client";

import { routes } from "@/app/routes";
import { MyOrderAppPreview } from "@/components/app-preview/MyOrderAppPreview";
import { CategoriesLists } from "@/components/catalogs/CategoriesLists";
import { TabLayout } from "@/components/layouts/TabLayout";
import { moaEnv } from "@/utils/config";
import { useCurrentMerchantQuery } from "@/utils/useCurrentMerchantQuery";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { Category } from "moa-merchants-ts-axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import { useEffect, useState } from "react";

export default function Page() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(780));
  const { data: currentMerchantData } = useCurrentMerchantQuery();
  const { push } = useRouter();
  const { status } = useSession();
  const [categoriesState, setCategoriesState] = useState<Category[]>([]);

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
        <CategoriesLists
          onCatalogUpdate={(categories) => {
            setCategoriesState(categories);
          }}
        />
        <MyOrderAppPreview
          key="device-preview"
          sx={{ pb: 2, position: "sticky", top: "72px" }}
          categories={categoriesState}
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
