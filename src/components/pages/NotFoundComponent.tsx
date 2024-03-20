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
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function NotFoundComponent() {
  const t = useTranslations("NotFoundComponent");
  const router = useRouter();
  const maxHeightCssString = useMaxHeightCssString();
  return (
    <Container sx={{ minHeight: maxHeightCssString, py: 2 }}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        textAlign={"center"}
        style={{ height: "100%" }}
      >
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography component="h1" variant="h4" pb={3}>
              {t("title")}
            </Typography>
            <Typography component="p" variant="body1" pb={3}>
              {t("description")}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push(routes.index)}
            >
              {t("button")}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
