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
          mode: "light", // prefersDarkMode ? "dark" : ,
          primary: {
            main: "#000000",
          },
          secondary: {
            main: "#1976d2",
            dark: "#1565c0",
            light: "#42a5f5",
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
