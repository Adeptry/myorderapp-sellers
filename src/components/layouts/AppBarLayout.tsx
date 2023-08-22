"use client";

import { routes } from "@/app/routes";
import { useCurrentMerchantQuery } from "@/contexts/networking/useCurrentMerchantQuery";
import { useNetworkingContext } from "@/contexts/networking/useNetworkingContext";
import { useSessionContext } from "@/contexts/session/useSessionContext";
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
import { useMutation } from "@tanstack/react-query";
import { StripeBillingPortalCreateInput } from "moa-merchants-ts-axios";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { useBoolean, useIsClient } from "usehooks-ts";

// https://mui.com/material-ui/react-app-bar/#app-bar-with-responsive-menu
// https://github.com/mui/material-ui/tree/v5.14.5/docs/data/material/getting-started/templates/dashboard

export default function AppBarLayout() {
  const { push } = useRouter();
  const isClient = useIsClient();
  const { value: drawerOpenState, toggle: toggleDrawerOpen } =
    useBoolean(false);
  const { session, setSession } = useSessionContext();
  const { data: currentMerchant } = useCurrentMerchantQuery();
  const { merchants } = useNetworkingContext();
  const createStripeBillingSessionUrlMutation = useMutation({
    mutationFn: (
      stripeBillingPortalCreateInput: StripeBillingPortalCreateInput
    ) => {
      return merchants.createStripeBillingSessionUrl({
        stripeBillingPortalCreateInput,
      });
    },
  });

  const canShowMenuListItems =
    currentMerchant?.data?.stripeCheckoutSessionId != null;

  return (
    <Fragment>
      <AppBar position="sticky">
        <Toolbar>
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MyOrderApp for Merchants
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpenState} onClose={toggleDrawerOpen}>
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
                    const response =
                      await createStripeBillingSessionUrlMutation.mutateAsync({
                        returnUrl: window.location.href,
                      });
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
