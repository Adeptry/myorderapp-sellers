"use client";

import { routes } from "@/app/routes";
import { AccountCircle } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useNetworkingContext } from "./NetworkingProvider";

export default function TopBar() {
  const { push } = useRouter();
  const { session, setSession } = useNetworkingContext();
  const [open, setIsOpen] = useState(false);

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          MyOrderApp for Merchants
        </Typography>

        {session && (
          <>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={() => {
                setIsOpen(true);
              }}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(open)}
              onClose={() => {
                setIsOpen(false);
              }}
            >
              <MenuItem
                onClick={() => {
                  setSession(null);
                  push(routes.signin);
                }}
              >
                Sign out
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
