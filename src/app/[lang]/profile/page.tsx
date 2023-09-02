"use client";

import { UserUpdateForm } from "@/components/forms/UserUpdateForm";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { Box, Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function Page() {
  const authStatus = useRedirectUnauthenticatedSessions();
  const common = useTranslations("Common");

  return (
    <Grid container justifyContent="center" py={2}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Box display="flex" justifyContent="center">
          <Typography component="h1" variant="h4" pb={3}>
            {common("profile")}
          </Typography>
        </Box>

        <UserUpdateForm skeleton={authStatus === "loading"} />
      </Grid>
    </Grid>
  );
}
