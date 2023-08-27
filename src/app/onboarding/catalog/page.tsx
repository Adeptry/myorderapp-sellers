"use client";

import { routes } from "@/app/routes";
import { MyOrderAppPreview } from "@/components/MyOrderAppPreview";
import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { CategoriesLists } from "@/components/catalogs/CategoriesLists";
import { useCurrentMerchantQuery } from "@/utils/useCurrentMerchantQuery";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { ThumbUp } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  Skeleton,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function Page() {
  const { push } = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { preloading } = useSessionedApiConfiguration();
  const { data: currentMerchantData } = useCurrentMerchantQuery();

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

      <Grid container columnSpacing={isSmallScreen ? 0 : 2} direction={"row"}>
        <Grid item xs={12} sm={12} md={6}>
          <Stack
            spacing={2}
            pt={1}
            pb={2}
            alignItems={"center"}
            textAlign={"center"}
          >
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
            <CategoriesLists />{" "}
          </Stack>
        </Grid>

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
      </Grid>
    </Stack>
  );
}
