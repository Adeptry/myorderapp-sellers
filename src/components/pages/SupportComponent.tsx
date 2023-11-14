"use client";

import { FaqAccordion } from "@/components/accordions/FaqAccordion";
import { SupportRequestForm } from "@/components/forms/SupportRequestForm";
import { moaEnv } from "@/moaEnv";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { QuestionAnswer } from "@mui/icons-material";
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
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
          <Stack gap={2}>
            <FaqAccordion />
            <Box textAlign="center">
              <Button
                size="large"
                startIcon={<QuestionAnswer />}
                variant="contained"
                color="secondary"
                onClick={() => window.open(moaEnv.faqUrl)}
              >
                {t("button")}
              </Button>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
