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

import { useAppBarHeight } from "./useAppBarHeight";

export function useFooterHeight(): number {
  return 57;
}

export function useHeaderAndFooterHeight(): number {
  const appBarHeight = useAppBarHeight();
  const footerHeight = useFooterHeight();
  return (appBarHeight ?? 0) + footerHeight;
}

export function useMaxHeightCssString(): string {
  return `calc(100vh - ${useHeaderAndFooterHeight()}px)`; // 57 is footer
}
