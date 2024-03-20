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

import { EmotionCacheProvider } from "@/components/providers/EmotionCacheProvider";
import { moaEnv } from "@/moaEnv";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";
import { ReactNode, useMemo } from "react";
import { useCookieContext } from "./CookieContext";

export function CachedThemeProvider({ children }: { children: ReactNode }) {
  const { colorModeCookieValue } = useCookieContext();
  const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const prefersDark =
    colorModeCookieValue === "dark"
      ? true
      : colorModeCookieValue === "light"
      ? false
      : systemPrefersDark;
  const theme = moaEnv.theme;

  const themeMemo = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: theme.typography.fontFamily,
        },
        palette: {
          mode: prefersDark ? "dark" : "light",
          primary: prefersDark
            ? theme.palette.dark.primary
            : theme.palette.light.primary,
          secondary: prefersDark
            ? theme.palette.dark.secondary
            : theme.palette.light.secondary,
        },
      }),
    [prefersDark, systemPrefersDark]
  );

  return (
    <EmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={themeMemo}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </EmotionCacheProvider>
  );
}
