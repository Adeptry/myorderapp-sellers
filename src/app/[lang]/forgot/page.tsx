"use client";

import { routes } from "@/app/routes";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";
import { useCurrentMerchantQuery } from "@/utils/useCurrentMerchantQuery";
import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";

export default function Page() {
  const { push } = useRouter();
  const currentMerchantQueryState = useCurrentMerchantQuery();
  const common = useTranslations("Common");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (currentMerchantQueryState.data) {
      push(routes.catalog);
    }
  }, [currentMerchantQueryState.data]);

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Box display="flex" justifyContent="center">
          <Typography component="h1" variant="h4" pb={3} textAlign={"center"}>
            {common("resetPassword")}
          </Typography>
        </Box>
        <ForgotPasswordForm preloading={false} />
      </Grid>
    </Grid>
  );
}
