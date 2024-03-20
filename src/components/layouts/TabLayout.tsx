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

import { Box, Grid, Skeleton, Stack, SxProps, Tab, Tabs } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";
import { useState } from "react";

interface Props {
  preloading?: boolean;
  tabLabels: string[];
  children: JSX.Element[];
  sx?: SxProps;
}

export const TabLayout: React.FC<Props> = ({
  children,
  tabLabels,
  sx,
  preloading,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [tabValueState, setTabValueState] = useState("0");

  return (
    <Stack style={{ marginTop: "6px" }} sx={sx}>
      <Box display={isSmallScreen ? "block" : "none"}>
        {preloading ? (
          <Skeleton height={"88px"} />
        ) : (
          <Tabs
            sx={{ pb: 3 }}
            variant="fullWidth"
            value={tabValueState}
            onChange={(e, v) => setTabValueState(v)}
            aria-label="tab layout example"
          >
            {children.map((_child, index) => {
              return (
                <Tab
                  label={tabLabels[index]}
                  value={String(index)}
                  key={index}
                />
              );
            })}
          </Tabs>
        )}
      </Box>
      <Grid container spacing={2}>
        {children.map((child, index) => (
          <Grid
            key={String(index)}
            item
            xs={isSmallScreen ? 12 : 6}
            display={
              isSmallScreen
                ? tabValueState !== String(index)
                  ? "none"
                  : "flex"
                : "flex"
            }
            justifyContent="center"
            alignItems="flex-start"
          >
            {child}
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};
