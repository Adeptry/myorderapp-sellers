"use client";

import AppBarLayout from "@/components/layouts/AppBarLayout";
import { FooterLayout } from "@/components/layouts/FooterLayout";
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
            <Container
              maxWidth={isSmallScreen ? undefined : "md"}
              sx={{
                minHeight: "calc(100vh - 120px)",
              }}
            >
              {children}
            </Container>
            <FooterLayout />
          </NetworkingProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
