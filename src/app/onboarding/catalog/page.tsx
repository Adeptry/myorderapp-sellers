"use client";

import { routes } from "@/app/routes";
import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { CategoriesLists } from "@/components/catalogs/CategoriesLists";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { ThumbUp } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function Page() {
  const { push } = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { preloading } = useSessionedApiConfiguration();

  return (
    <Stack spacing={2} py={2}>
      {preloading ? (
        <Skeleton height={"24px"} />
      ) : (
        <OnboardingStepper
          activeStep={OnboardingSteps.square}
          sx={{ width: "100%" }}
        />
      )}

      <Grid
        container
        columnSpacing={isSmallScreen ? 0 : 2}
        direction={isSmallScreen ? "column-reverse" : "row"}
      >
        <Grid item xs={12} sm={12} md={6}>
          <CategoriesLists />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Stack
            spacing={2}
            pt={1}
            pb={2}
            alignItems={"center"}
            textAlign={"center"}
          >
            <Typography variant="h4">Prepare your catalog</Typography>

            <Typography variant="body1">
              Here you can manage and tailor your Catalog Items as desired. Any
              modifications made in Square are synchronized with this dashboard
              and your app, guaranteeing your customers access to the most
              current data. You can re-order, selectively disable items just in
              the app, and upload images -{" "}
              <strong>before or after app launch!</strong>
            </Typography>
            <Typography variant="body1">
              When set, click the button below to subscribe and initiate app
              publishing.
            </Typography>

            <Box width="auto" display="inline-block">
              {preloading ? (
                <Skeleton height={"42px"} width={"100px"} />
              ) : (
                <Button
                  size="large"
                  variant="contained"
                  color="secondary"
                  startIcon={<ThumbUp />}
                  onClick={() => {
                    push(routes.onboarding.stripe.index);
                  }}
                >
                  I'm ready
                </Button>
              )}
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
