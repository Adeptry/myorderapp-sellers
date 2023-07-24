"use client";

import { useMediaQuery } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Public_Sans } from "next/font/google";
import * as React from "react";
import NextAppDirEmotionCacheProvider from "./EmotionCache";
import { ReactNode, useMemo } from "react";

export const fontFamily = Public_Sans({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

export default function ThemeRegistry({
  children,
}: {
  children: ReactNode;
}) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: fontFamily.style.fontFamily,
        },
        palette: {
          primary: {
            main: "#000000",
          },
          // secondary: {
          //   main: "#F5F5F5",
          // },
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
