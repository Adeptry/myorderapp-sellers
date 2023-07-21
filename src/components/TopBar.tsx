"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import dynamic from "next/dynamic";

const SignOutMenu = dynamic(() => import("@/components/SignOutMenu"), {
  ssr: false,
});

export default function TopBar() {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          MyOrderApp for Merchants
        </Typography>
        <SignOutMenu />
      </Toolbar>
    </AppBar>
  );
}
