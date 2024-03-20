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

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";

export function useAppBarHeight(): number | undefined {
  const {
    mixins: { toolbar },
    breakpoints,
  } = useTheme();
  const toolbarDesktopQuery = breakpoints.up("sm");
  const toolbarLandscapeQuery = `${breakpoints.up(
    "xs"
  )} and (orientation: landscape)`;
  const isDesktop = useMediaQuery(toolbarDesktopQuery);
  const isLandscape = useMediaQuery(toolbarLandscapeQuery);

  let currentToolbarMinHeight: any;

  if (isDesktop && toolbar[toolbarDesktopQuery]) {
    currentToolbarMinHeight = toolbar[toolbarDesktopQuery];
  } else if (isLandscape && toolbar[toolbarLandscapeQuery]) {
    currentToolbarMinHeight = toolbar[toolbarLandscapeQuery];
  } else if (toolbar) {
    currentToolbarMinHeight = toolbar;
  }

  return currentToolbarMinHeight?.minHeight ?? 0;
}
