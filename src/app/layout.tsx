import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import TopBar from "@/components/TopBar";
import { Box } from "@mui/material";
import { Roboto } from "next/font/google";
import * as React from "react";

export const metadata = {
  title: "MyOrderApp for Merchants",
  description: "MyOrderApp for Merchants",
};

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ThemeRegistry>
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
        </ThemeRegistry>
      </body>
    </html>
  );
}
