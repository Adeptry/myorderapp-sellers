"use client";

import { FaqAccordion } from "@/components/accordions/CheckoutFaqAccordion";
import { SupportRequestForm } from "@/components/forms/SupportRequestForm";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export function SupportComponent() {
  useRedirectUnauthenticatedSessions();

  const t = useTranslations("SupportComponent");
  const maxHeightCssString = useMaxHeightCssString();

  return (
    <Container sx={{ minHeight: maxHeightCssString }}>
      <Grid container justifyContent="center" py={2} spacing={2}>
        <Grid item xs={12} sm={12} md={6}>
          <Box display="flex" justifyContent="center">
            <Typography component="h1" variant="h4" pb={3}>
              {t("formTitle")}
            </Typography>
          </Box>
          <SupportRequestForm />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Box display="flex" justifyContent="center">
            <Typography component="h1" variant="h4" pb={3}>
              {t("faqTitle")}
            </Typography>
          </Box>
          <FaqAccordion />
        </Grid>
      </Grid>
    </Container>
  );
}
