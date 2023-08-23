"use client";

import DevicePreview from "@/components/DevicePreview";
import { CategoriesLists } from "@/components/catalogs/CategoriesLists";
import { TabLayout } from "@/components/layouts/TabLayout";
import { Stack, useMediaQuery, useTheme } from "@mui/material";

export default function Page() {
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down(780));

  return (
    <Stack spacing={2} py={2}>
      <TabLayout
        tabLabels={["Catalog", "Preview"]}
        sx={{ pt: isSmallScreen ? 0 : 3, pb: 3 }}
      >
        <CategoriesLists />
        <DevicePreview key="device-preview" sx={{ pb: 2 }} />
      </TabLayout>
    </Stack>
  );
}
