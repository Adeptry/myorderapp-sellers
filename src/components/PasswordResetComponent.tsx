"use client";

import { PasswordResetForm } from "@/components/forms/PasswordResetForm";
import { useRedirectAuthenticatedSessions } from "@/routing/useRedirectAuthenticatedSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Box, Container, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

export function PasswordResetComponent() {
  useRedirectAuthenticatedSessions();
  const t = useTranslations("PasswordResetComponent");
  const maxHeightCssString = useMaxHeightCssString();

  return (
    <Container sx={{ minHeight: maxHeightCssString }}>
      <Grid container justifyContent="center" py={2}>
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Box display="flex" justifyContent="center">
            <Typography component="h1" variant="h4" pb={3} textAlign={"center"}>
              {t("title")}
            </Typography>
          </Box>
          <Suspense>
            <PasswordResetForm preloading={false} />
          </Suspense>
        </Grid>
      </Grid>
    </Container>
  );
}
