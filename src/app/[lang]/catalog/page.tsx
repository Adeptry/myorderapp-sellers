"use client";

import { routes } from "@/app/routes";
import { MyOrderAppPreview } from "@/components/app-preview/MyOrderAppPreview";
import { CategoriesLists } from "@/components/catalogs/CategoriesLists";
import { TabLayout } from "@/components/layouts/TabLayout";
import { moaEnv } from "@/utils/config";
import { useCurrentMerchantQuery } from "@/utils/useCurrentMerchantQuery";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";

export default function Page() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(780));
  const { data: currentMerchantData } = useCurrentMerchantQuery();
  const { push } = useRouter();
  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      push(routes.signin);
    }
  }, [status]);
  return (
    <Stack spacing={2} py={2}>
      <TabLayout
        tabLabels={["Catalog", "Preview"]}
        sx={{ pt: isSmallScreen ? 0 : 3, pb: 3 }}
      >
        <CategoriesLists />
        <MyOrderAppPreview
          key="device-preview"
          sx={{ pb: 2, position: "sticky", top: "72px" }}
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
