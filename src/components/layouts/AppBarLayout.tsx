"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import dynamic from "next/dynamic";

const AccountButton = dynamic(() =>
  import("@/components/AccountButton").then((mod) => mod.AccountButton)
);

export default function AppBarLayout() {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          MyOrderApp for Merchants
        </Typography>
        <AccountButton />
      </Toolbar>
    </AppBar>
  );
}
