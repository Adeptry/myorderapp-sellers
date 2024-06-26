/*
    This code is part of the myorderapp-sellers front-end.
    Copyright (C) 2024  Adeptry, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

"use client";

import { routes } from "@/app/routes";
import { CatalogAccordion } from "@/components/accordions/CatalogAccordion";
import { MyOrderAppPreview } from "@/components/app-preview/MyOrderAppPreview";
import { TabLayout } from "@/components/layouts/TabLayout";
import { OnboardingStepper } from "@/components/steppers/OnboardingStepper";
import { useGetAppConfigMeQuery } from "@/networking/queries/useGetAppConfigMeQuery";
import { useGetCategoriesMeQuery } from "@/networking/queries/useGetCategoriesMeQuery";
import { useRedirectSetupSessions } from "@/routing/useRedirectSetupSessions";
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
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useState } from "react";
import { SetupCatalogDialog } from "../dialogs/SetupCatalogDialog";

export function SetupCatalogComponent() {
  useRedirectSetupSessions(routes.catalog);
  const { push } = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(780));
  const { status } = useSession();
  const currentCatalogQuery = useGetCategoriesMeQuery();
  const currentCatalogCategories = currentCatalogQuery.data?.data ?? [];
  const { data: appConfig } = useGetAppConfigMeQuery();

  const skeleton = status === "loading";
  const t = useTranslations("SetupCatalogComponent");
  const maxHeightCssString = useMaxHeightCssString();
  const { data } = useSession();
  const [showDialogState, setShowDialogState] = useState<boolean>(true);

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
            appConfig={{ ...appConfig, useAdaptiveScaffold: false }}
            authentication={data?.user}
            categories={currentCatalogCategories}
          />
        </TabLayout>
      </Stack>
      <SetupCatalogDialog
        open={showDialogState}
        onClose={() => setShowDialogState(false)}
      />
    </Container>
  );
}
