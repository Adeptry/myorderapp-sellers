"use client";

import { routes } from "@/app/routes";
import { LoginEmailForm } from "@/components/forms/LoginEmailForm";
import { useRedirectAuthenticatedSessions } from "@/routing/useRedirectAuthenticatedSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export function LoginComponent() {
  const authStatus = useRedirectAuthenticatedSessions();
  const t = useTranslations("LoginComponent");
  const maxHeightCssString = useMaxHeightCssString();
  return (
    <Container sx={{ minHeight: maxHeightCssString }}>
      <Grid container justifyContent="center" py={2}>
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Box display="flex" justifyContent="center">
            <Typography component="h1" variant="h4" pb={3}>
              {t("title")}
            </Typography>
          </Box>

          <LoginEmailForm
            callbackUrl={routes.dashboard}
            skeleton={authStatus === "loading"}
          />
        </Grid>
      </Grid>
    </Container>
  );
}