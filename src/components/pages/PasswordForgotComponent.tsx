"use client";

import { PasswordForgotForm } from "@/components/forms/PasswordForgotForm";
import { useRedirectAuthenticatedSessions } from "@/routing/useRedirectAuthenticatedSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Box, Container, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";

export function PasswordForgotComponent() {
  useRedirectAuthenticatedSessions();
  const t = useTranslations("PasswordForgotComponent");
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
          <PasswordForgotForm preloading={false} />
        </Grid>
      </Grid>
    </Container>
  );
}
