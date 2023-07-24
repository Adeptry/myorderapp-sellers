"use client";

import AppBarLayout from "@/components/layouts/AppBarLayout";
import { NetworkingProvider } from "@/components/networking/NetworkingProvider";
import ThemeRegistry from "@/components/theme/ThemeRegistry";
import { Box } from "@mui/material";
import * as React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <NetworkingProvider>
            <AppBarLayout />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                bgcolor: "background.default",
                mt: ["48px", "56px", "64px"],
                p: 3,
              }}
            >
              {children}
            </Box>
          </NetworkingProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
