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

import { LegalMenu } from "@/components/menus/LegalMenu";
import { CurrencySelector } from "@/components/selectors/CurrencySelector";
import { LanguageSelector } from "@/components/selectors/LanguageSelector";
import { moaEnv } from "@/moaEnv";
import { Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";

export const FooterComponent = () => {
  const year = new Date().getFullYear();
  const theme = useTheme();
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Grid
      container
      px={2}
      py={1}
      justifyContent="space-between"
      alignItems={"center"}
    >
      <Grid item md={4} xs={"auto"}>
        <LegalMenu />
      </Grid>
      {!isExtraSmallScreen && (
        <Grid item textAlign="center" md={4} xs="auto">
          <Typography variant="body1">
            {isSmallScreen ? moaEnv.abbreviation : moaEnv.shortName} &copy;{" "}
            {year}
          </Typography>
        </Grid>
      )}
      <Grid item md={4}>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <CurrencySelector />
          <LanguageSelector />
        </Stack>
      </Grid>
    </Grid>
  );
};
