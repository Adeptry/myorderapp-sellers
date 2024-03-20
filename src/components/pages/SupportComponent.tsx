/*
    This code is part of the myorderapp-sellers front-end.
    Copyright (C) 2024  Adeptry, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

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
