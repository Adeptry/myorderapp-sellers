"use client";

import { useMediaQuery } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ReactNode, useMemo } from "react";
import NextAppDirEmotionCacheProvider from "./EmotionCache";

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI",
          Oxygen-Sans, Ubuntu, Cantarell, Roboto,
          "Helvetica Neue", sans-serif`,
        },
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: {
            main: prefersDarkMode ? "#90caf9" : "#1976d2",
            dark: prefersDarkMode ? "#5e92f3" : "#1565c0",
            light: prefersDarkMode ? "#9be7ff" : "#42a5f5",
          },
          secondary: {
            main: prefersDarkMode ? "#e0e0e0" : "#424242",
            dark: prefersDarkMode ? "#aeaeae" : "#1b1b1b",
            light: prefersDarkMode ? "#ffffff" : "#6d6d6d",
          },
        },
      }),
    [prefersDarkMode]
  );

  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
