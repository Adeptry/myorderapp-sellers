"use client";

import AppBarLayout from "@/components/layouts/AppBarLayout";
import { FooterLayout } from "@/components/layouts/FooterLayout";
import ThemeRegistry from "@/components/theme/ThemeRegistry";
import { NetworkingProvider } from "@/contexts/networking/NetworkingProvider";
import { SessionProvider } from "@/contexts/session/SessionProvider";
import { Container, useMediaQuery, useTheme } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <SessionProvider>
            <NetworkingProvider>
              <QueryClientProvider client={queryClient}>
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
              </QueryClientProvider>
            </NetworkingProvider>
          </SessionProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
