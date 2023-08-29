"use client";

import { routes } from "@/app/routes";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";
import { useCurrentMerchantQuery } from "@/utils/useCurrentMerchantQuery";
import { Box, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";

export default function Page() {
  const { push } = useRouter();
  const currentMerchantQueryState = useCurrentMerchantQuery();

  useEffect(() => {
    if (currentMerchantQueryState.data) {
      push(routes.catalog);
    }
  }, [currentMerchantQueryState.data]);

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={6}>
        <Box display="flex" justifyContent="center">
          <Typography component="h1" variant="h4" py={3}>
            Reset Password
          </Typography>
        </Box>
        <ForgotPasswordForm preloading={false} />
      </Grid>
    </Grid>
  );
}
