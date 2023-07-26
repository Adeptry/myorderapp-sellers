"use client";

import AppBarLayout from "@/components/layouts/AppBarLayout";
import { NetworkingProvider } from "@/components/networking/NetworkingProvider";
import ThemeRegistry from "@/components/theme/ThemeRegistry";
import { Container, useMediaQuery, useTheme } from "@mui/material";
import * as React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <NetworkingProvider>
            <AppBarLayout />
            <Container maxWidth={isSmallScreen ? undefined : "md"}>
              {children}
            </Container>
          </NetworkingProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
