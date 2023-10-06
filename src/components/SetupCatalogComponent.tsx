"use client";

import { routes } from "@/app/routes";
import { CatalogAccordion } from "@/components/accordions/CatalogAccordion";
import { MyOrderAppPreview } from "@/components/app-preview/MyOrderAppPreview";
import { TabLayout } from "@/components/layouts/TabLayout";
import { OnboardingStepper } from "@/components/steppers/OnboardingStepper";
import { moaEnv } from "@/moaEnv";
import { useGetCategoriesMeQuery } from "@/queries/useGetCategoriesMeQuery";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import {
  ArrowForward,
  CheckCircleOutline,
  InfoOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Grid,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";

export function SetupCatalogComponent() {
  useRedirectUnauthenticatedSessions();
  const { push } = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(780));
  const { status } = useSession();
  const currentCatalogQuery = useGetCategoriesMeQuery();
  const currentCatalogCategories = currentCatalogQuery.data?.data ?? [];
  const locale = useLocale();

  const skeleton = status === "loading";
  const t = useTranslations("SetupCatalogComponent");
  const maxHeightCssString = useMaxHeightCssString();
  const { data } = useSession();

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
          <OnboardingStepper step="square" sx={{ width: "100%" }} />
        )}

        <TabLayout
          tabLabels={[t("catalogTabLabel"), t("previewTabLabel")]}
          sx={{ pt: isSmallScreen ? 0 : 3 }}
        >
          <Grid
            container
            key="categories-grid"
            direction="column"
            spacing={2}
            sx={{ width: "100%" }}
          >
            <Grid
              item
              key="categories-grid-button"
              alignSelf={"center"}
              width="100%"
            >
              {skeleton ? (
                <Skeleton height="56px" width="200px" />
              ) : (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems={"center"}
                >
                  <Box></Box>
                  <Button
                    size="large"
                    variant="contained"
                    color="secondary"
                    endIcon={<ArrowForward />}
                    startIcon={<CheckCircleOutline />}
                    onClick={() => {
                      push(routes.setup.plan);
                    }}
                  >
                    {t("continueButton")}
                  </Button>
                  <Tooltip title={<Typography>{t("tooltip")}</Typography>}>
                    <InfoOutlined />
                  </Tooltip>
                </Stack>
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
            authentication={data?.user}
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
