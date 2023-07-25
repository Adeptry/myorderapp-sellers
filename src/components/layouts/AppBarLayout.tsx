"use client";

import { routes } from "@/app/routes";
import { AccountCircle } from "@mui/icons-material";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import { IconButton, Menu, MenuItem } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useIsClient } from "usehooks-ts";
import { useNetworkingContext } from "../networking/useNetworkingContext";

export default function AppBarLayout() {
  const { push } = useRouter();
  const isClient = useIsClient();
  const { session, setSession } = useNetworkingContext(); // uses local storage to determine session
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit">
          <TouchAppIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          MyOrderApp for Merchants
        </Typography>
        {isClient && session && (
          <>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={(event) => {
                setAnchorEl(event.currentTarget);
              }}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
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
              open={Boolean(anchorEl)}
              onClose={() => {
                setAnchorEl(null);
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
