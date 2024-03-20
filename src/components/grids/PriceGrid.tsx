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

import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";
import { Tier0CheckoutCard } from "../cards/Tier0CheckoutCard";
import { Tier1CheckoutCard } from "../cards/Tier1CheckoutCard";
import { Tier2CheckoutCard } from "../cards/Tier2CheckoutCard";

export function PriceGrid() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Grid
      container
      columnSpacing={2}
      rowSpacing={2}
      direction={isSmallScreen ? "column-reverse" : "row"}
      sx={{
        pr: 1,
      }}
    >
      <Grid item xs={12} md={4}>
        <Tier0CheckoutCard />
      </Grid>
      <Grid item xs={12} md={4}>
        <Tier1CheckoutCard />
      </Grid>
      <Grid item xs={12} md={4}>
        <Tier2CheckoutCard />
      </Grid>
    </Grid>
  );
}
