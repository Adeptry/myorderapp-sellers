"use client";

import { EmotionCacheProvider } from "@/components/EmotionCacheProvider";
import { useCookieContext } from "@/contexts/CookieContext";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";
import { ReactNode, useMemo } from "react";

export function ThemeRegistry({ children }: { children: ReactNode }) {
  const { colorModeCookieValue } = useCookieContext();
  const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const cookieOrSystemPrefersDark =
    colorModeCookieValue === "dark"
      ? true
      : colorModeCookieValue === "light"
      ? false
      : systemPrefersDark;

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI",
          Oxygen-Sans, Ubuntu, Cantarell, Roboto,
          "Helvetica Neue", sans-serif`,
        },
        palette: {
          mode: cookieOrSystemPrefersDark ? "dark" : "light",
          primary: {
            main: cookieOrSystemPrefersDark ? "#90caf9" : "#1976d2",
            dark: cookieOrSystemPrefersDark ? "#5e92f3" : "#1565c0",
            light: cookieOrSystemPrefersDark ? "#9be7ff" : "#42a5f5",
          },
          secondary: {
            main: cookieOrSystemPrefersDark ? "#e0e0e0" : "#1e1e1e",
            dark: cookieOrSystemPrefersDark ? "#aeaeae" : "#1b1b1b",
            light: cookieOrSystemPrefersDark ? "#ffffff" : "#6d6d6d",
          },
        },
      }),
    [cookieOrSystemPrefersDark, systemPrefersDark]
  );

  return (
    <EmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </EmotionCacheProvider>
  );
}
