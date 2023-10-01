"use client";

import { FaqAccordion } from "@/components/accordions/CheckoutFaqAccordion";
import { SupportRequestForm } from "@/components/forms/SupportRequestForm";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { Box, Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function Page() {
  useRedirectUnauthenticatedSessions();

  const common = useTranslations("Common");

  return (
    <Grid container justifyContent="center" py={2} spacing={2}>
      <Grid item xs={12} sm={12} md={6}>
        <Box display="flex" justifyContent="center">
          <Typography component="h1" variant="h4" pb={3}>
            {common("support")}
          </Typography>
        </Box>
        <SupportRequestForm />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Box display="flex" justifyContent="center">
          <Typography component="h1" variant="h4" pb={3}>
            {common("frequentlyAskedQuestions")}
          </Typography>
        </Box>
        <FaqAccordion />
      </Grid>
    </Grid>
  );
}
