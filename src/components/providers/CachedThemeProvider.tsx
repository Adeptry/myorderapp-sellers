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
