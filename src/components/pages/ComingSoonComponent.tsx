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

import { routes } from "@/app/routes";
import { moaEnv } from "@/moaEnv";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ComingSoonComponent() {
  const t = useTranslations("ComingSoonComponent");
  const maxHeightCssString = useMaxHeightCssString();

  const router = useRouter();

  useEffect(() => {
    if (!moaEnv.comingSoon) {
      router.push(routes.index);
    }
  }, []);

  return (
    <Container sx={{ minHeight: maxHeightCssString }}>
      <Grid container justifyContent="center" py={2}>
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign={"center"}
          >
            <Typography component="h1" variant="h4" pb={3}>
              {t("title")}
            </Typography>
            <Typography component="p" variant="body1" pb={3}>
              {t("description")}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
