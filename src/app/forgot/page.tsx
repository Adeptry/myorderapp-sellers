"use client";

import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";
import { useCurrentMerchantQuery } from "@/contexts/networking/useCurrentMerchantQuery";
import { Box, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { routes } from "../routes";

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
