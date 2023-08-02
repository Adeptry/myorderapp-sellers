"use client";

import { routes } from "@/app/routes";
import {
  AppShortcut,
  CreditCard,
  ExitToApp,
  Menu,
  MenuBook,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { Fragment, useEffect } from "react";
import { useBoolean, useIsClient } from "usehooks-ts";
import { useNetworkingContext } from "../networking/useNetworkingContext";
import { useNetworkingFunctionNP } from "../networking/useNetworkingFunctionNP";
import { useNetworkingFunctionP } from "../networking/useNetworkingFunctionP";

export default function AppBarLayout() {
  const { push } = useRouter();
  const isClient = useIsClient();
  const { value: drawerOpenState, toggle: toggleDrawerOpen } =
    useBoolean(false);
  const { session, setSession, merchants } = useNetworkingContext(); // uses local storage to determine session
  const [getCurrentMerchantState, getCurrentMerchantFn] =
    useNetworkingFunctionNP(merchants.getCurrentMerchant.bind(merchants), true);
  const [stripeCreateBillingSessionUrlState, stripeCreateBillingSessionUrlFn] =
    useNetworkingFunctionP(
      merchants.stripeCreateBillingSessionUrl.bind(merchants)
    );

  useEffect(() => {
    try {
      getCurrentMerchantFn({});
    } catch (error) {}
  }, [session]);

  const canShowMenuListItems =
    getCurrentMerchantState.data?.stripeCheckoutSessionId != null;

  return (
    <Fragment>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MyOrderApp for Merchants
          </Typography>
          <Box display={isClient && session ? "block" : "none"}>
            <IconButton
              onClick={toggleDrawerOpen}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
            >
              <Menu />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpenState} onClose={toggleDrawerOpen} anchor="right">
        <List>
          {canShowMenuListItems && (
            <Fragment>
              <ListItem key={"catalog-list-item"} disablePadding>
                <ListItemButton
                  onClick={() => {
                    push(routes.catalog);
                    toggleDrawerOpen();
                  }}
                >
                  <ListItemIcon>
                    <MenuBook />
                  </ListItemIcon>
                  <ListItemText primary={"Catalog"} />
                </ListItemButton>
              </ListItem>
              <ListItem key={"app-configurator-list-item"} disablePadding>
                <ListItemButton
                  onClick={() => {
                    push(routes.configurator);
                    toggleDrawerOpen();
                  }}
                >
                  <ListItemIcon>
                    <AppShortcut />
                  </ListItemIcon>
                  <ListItemText primary={"App Configurator"} />
                </ListItemButton>
              </ListItem>
              <ListItem key={"manage-account-list-item"} disablePadding>
                <ListItemButton
                  onClick={async () => {
                    const response = await stripeCreateBillingSessionUrlFn(
                      {
                        stripeBillingPortalCreateInput: {
                          returnUrl: window.location.href,
                        },
                      },
                      {}
                    );
                    if (response.data?.url) {
                      push(response.data.url);
                    }

                    toggleDrawerOpen();
                  }}
                >
                  <ListItemIcon>
                    <CreditCard />
                  </ListItemIcon>
                  <ListItemText primary={"Manage Account"} />
                </ListItemButton>
              </ListItem>
            </Fragment>
          )}
          <ListItem key={"sign-out-list-item"} disablePadding>
            <ListItemButton
              onClick={() => {
                setSession(null);
                push(routes.signin);
                toggleDrawerOpen();
              }}
            >
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary={"Sign out"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Fragment>
  );
}
