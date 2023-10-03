"use client";

import { routes } from "@/app/routes";
import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { CatalogAccordion } from "@/components/accordions/CatalogAccordion";
import { MyOrderAppPreview } from "@/components/app-preview/MyOrderAppPreview";
import { TabLayout } from "@/components/layouts/TabLayout";
import { useGetCategoriesMeQuery } from "@/queries/useGetCategoriesMeQuery";
import { useGetMerchantMeQuery } from "@/queries/useGetMerchantMeQuery";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { moaEnv } from "@/utils/moaEnv";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { ArrowForward, CheckCircleOutline } from "@mui/icons-material";
import { Button, Container, Grid, Skeleton, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";

export default function Page() {
  useRedirectUnauthenticatedSessions();
  const { push } = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(780));
  const { status } = useSession();
  const currentCatalogQuery = useGetCategoriesMeQuery();
  const currentCatalogCategories = currentCatalogQuery.data?.data ?? [];
  const locale = useLocale();

  const skeleton = status === "loading";
  const { data: currentMerchantData } = useGetMerchantMeQuery();
  const common = useTranslations("Common");
  const maxHeightCssString = useMaxHeightCssString();

  useEffect(() => {
    if (status === "unauthenticated") {
      push(routes.login);
    }
  }, [status]);

  return (
    <Container sx={{ minHeight: maxHeightCssString }}>
      <Stack spacing={2} py={2}>
        {skeleton ? (
          <Skeleton height={"24px"} />
        ) : (
          <OnboardingStepper
            activeStep={OnboardingSteps.square}
            sx={{ width: "100%" }}
          />
        )}

        <TabLayout
          tabLabels={[common("catalog"), common("preview")]}
          sx={{ pt: isSmallScreen ? 0 : 3 }}
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
                  endIcon={<ArrowForward />}
                  startIcon={<CheckCircleOutline />}
                  onClick={() => {
                    push(routes.setup.tier);
                  }}
                >
                  {common("acceptAndContinue")}
                </Button>
              )}
            </Grid>
            <Grid item key="categories-grid-item">
              <CatalogAccordion />
            </Grid>
          </Grid>

          <MyOrderAppPreview
            key="device-preview"
            sx={{
              py: 2,
              position: "sticky",
              top: "72px", // Adjusted for the toolbar
            }}
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
    </Container>
  );
}
