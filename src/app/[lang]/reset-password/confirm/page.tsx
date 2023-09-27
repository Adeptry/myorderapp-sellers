"use client";

import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";
import { useRedirectAuthenticatedSessions } from "@/routing/useRedirectAuthenticatedSessions";
import { Box, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";

export default function Page() {
  useRedirectAuthenticatedSessions();
  const common = useTranslations("Common");

  return (
    <Grid container justifyContent="center" py={2}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Box display="flex" justifyContent="center">
          <Typography component="h1" variant="h4" pb={3} textAlign={"center"}>
            {common("resetPassword")}
          </Typography>
        </Box>
        <ResetPasswordForm preloading={false} />
      </Grid>
    </Grid>
  );
}