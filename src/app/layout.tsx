import { NetworkingProvider } from "@/components/NetworkingProvider";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import TopBar from "@/components/TopBar";
import { Box } from "@mui/material";
import * as React from "react";

export const metadata = {
  title: "MyOrderApp for Merchants",
  description: "MyOrderApp for Merchants",
};

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
            <TopBar />
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
