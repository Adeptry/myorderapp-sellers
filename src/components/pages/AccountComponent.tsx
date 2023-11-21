"use client";

import { UserUpdateForm } from "@/components/forms/UserUpdateForm";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useCookieContext } from "../providers/CookieContext";

export function AccountComponent() {
  useRedirectUnauthenticatedSessions();
  const t = useTranslations("AccountComponent");
  const maxHeightCssString = useMaxHeightCssString();
  const { setNewSquareCsrfTokenCookieValue } = useCookieContext();
  useEffect(() => {
    setNewSquareCsrfTokenCookieValue();
  }, []);
  return (
    <Container sx={{ minHeight: maxHeightCssString }}>
      <Grid container justifyContent="center" py={2}>
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Box display="flex" justifyContent="center">
            <Typography component="h1" variant="h4" pb={3}>
              {t("title")}
            </Typography>
          </Box>

          <UserUpdateForm />
        </Grid>
      </Grid>
    </Container>
  );
}
