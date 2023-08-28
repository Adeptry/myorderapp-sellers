"use client";

import { routes } from "@/app/routes";
import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { MyOrderAppPreview } from "@/components/app-preview/MyOrderAppPreview";
import { CategoriesLists } from "@/components/catalogs/CategoriesLists";
import { TabLayout } from "@/components/layouts/TabLayout";
import { moaEnv } from "@/utils/config";
import { useCurrentMerchantQuery } from "@/utils/useCurrentMerchantQuery";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { Save } from "@mui/icons-material";
import {
  Button,
  Grid,
  Skeleton,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Category } from "moa-merchants-ts-axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// 64 + 16 + 24 + 72 + 6
export default function Page() {
  const { push } = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(780));
  const { status } = useSessionedApiConfiguration();
  const [categoriesState, setCategoriesState] = useState<Category[]>([]);
  const skeleton = status === "loading" || categoriesState.length === 0;
  const { data: currentMerchantData } = useCurrentMerchantQuery();

  useEffect(() => {
    if (status === "unauthenticated") {
      push(routes.signin);
    }
  }, [status]);

  return (
    <Stack spacing={2} py={2}>
      {skeleton ? (
        <Skeleton height={"24px"} />
      ) : (
        <OnboardingStepper
          activeStep={OnboardingSteps.square}
          sx={{ width: "100%", pt: isSmallScreen ? 0 : 2 }}
        />
      )}

      <TabLayout
        tabLabels={["Categories", "Preview"]}
        sx={{ pt: isSmallScreen ? 0 : 3, pb: 3 }}
      >
        <Grid
          container
          key="categories-grid"
          direction="column"
          spacing={2}
          sx={{ width: "100%" }}
        >
          <Grid item key="categories-grid-button" alignSelf={"center"}>
            {skeleton ? (
              <Skeleton height="56px" width="200px" />
            ) : (
              <Button
                size="large"
                variant="contained"
                color="secondary"
                startIcon={<Save />}
                onClick={() => {
                  push(routes.onboarding.stripe.index);
                }}
              >
                Save and Continue
              </Button>
            )}
          </Grid>
          <Grid item key="categories-grid-item">
            <CategoriesLists
              onCatalogUpdate={(categories) => {
                setCategoriesState(categories);
              }}
            />
          </Grid>
        </Grid>

        <MyOrderAppPreview
          key="device-preview"
          sx={{
            py: 2,
            position: "sticky",
            top: "72px", // Adjusted for the toolbar
          }}
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
{
  /*  */
}
