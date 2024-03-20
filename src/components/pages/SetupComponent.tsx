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
import { useRedirectNotSetupSessions } from "@/routing/useRedirectNotSetupSessions";
import { useRedirectSetupSessions } from "@/routing/useRedirectSetupSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Box, CircularProgress } from "@mui/material";

export function SetupComponent() {
  useRedirectNotSetupSessions();
  useRedirectSetupSessions(routes.dashboard);

  const maxHeightCssString = useMaxHeightCssString();

  return (
    <Box
      height={maxHeightCssString}
      display={"flex"}
      sx={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
