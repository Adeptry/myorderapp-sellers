"use client";

import { MyOrderAppPreview } from "@/components/MyOrderAppPreview";
import { CategoriesLists } from "@/components/catalogs/CategoriesLists";
import { TabLayout } from "@/components/layouts/TabLayout";
import { useCurrentMerchantQuery } from "@/utils/useCurrentMerchantQuery";
import { Stack, useMediaQuery, useTheme } from "@mui/material";

export default function Page() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(780));
  const { data: currentMerchantData } = useCurrentMerchantQuery();

  return (
    <Stack spacing={2} py={2}>
      <TabLayout
        tabLabels={["Catalog", "Preview"]}
        sx={{ pt: isSmallScreen ? 0 : 3, pb: 3 }}
      >
        <CategoriesLists />
        <MyOrderAppPreview
          key="device-preview"
          sx={{ pb: 2 }}
          theme={null}
          environment={{
            apiBaseUrl: process.env.NEXT_PUBLIC_BACKEND_DOMAIN!,
            apiKey: process.env.NEXT_PUBLIC_BACKEND_API_KEY!,
            merchantFrontendUrl: process.env.NEXT_PUBLIC_FRONTEND_DOMAIN!,
            merchantId: currentMerchantData?.id ?? null,
            isPreview: true,
          }}
        />
      </TabLayout>
    </Stack>
  );
}
