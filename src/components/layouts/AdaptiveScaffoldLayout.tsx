"use client";

import { routes } from "@/app/routes";
import { FooterComponent } from "@/components/pages/FooterComponent";
import { moaEnv } from "@/moaEnv";
import { useGetMerchantMeQuery } from "@/networking/queries/useGetMerchantMeQuery";
import { fullNameForMerchant } from "@/utils/fullNameForMerchant";
import { initialsForMerchant } from "@/utils/initialsForMerchant";
import { isMerchantSetupFn } from "@/utils/isMerchantSetup";
import { stringToColor } from "@/utils/stringToColor";
import { useAppBarHeight } from "@/utils/useAppBarHeight";
import { useCurrentMerchantMoaUrl } from "@/utils/useCurrentMerchantMoaUrl";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import {
  AccountCircleOutlined,
  AppShortcut,
  ArrowBack,
  Brightness6,
  DarkMode,
  Dashboard,
  Group,
  LightMode,
  ListAlt,
  Logout,
  MenuBook,
  Menu as MenuIcon,
  Payment,
  Store,
  SupportAgent,
  Web,
} from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MerchantsApi } from "myorderapp-square";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import { Fragment, ReactNode, useState } from "react";
import { useBoolean } from "usehooks-ts";
import { MoaLink } from "../links/MoaLink";
import { useCookieContext } from "../providers/CookieContext";

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AdaptiveAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  [theme.breakpoints.up("md")]: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  },
}));

const AdaptiveDrawer = styled(MuiDrawer)(({ theme, open }) => ({
  [theme.breakpoints.up("md")]: {
    "& .MuiDrawer-paper": {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: "border-box",
      ...(!open && {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
      }),
    },
  },
}));

export function AdaptiveScaffoldLayout(props: { children: ReactNode }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const t = useTranslations("AdaptiveScaffoldLayout");
  const appBarHeight = useAppBarHeight();

  const { push } = useRouter();
  const pathname = usePathname();
  const currentMerchantMoaUrl = useCurrentMerchantMoaUrl();
  const {
    value: drawerOpenState,
    toggle: toggleDrawerOpenState,
    setFalse: setDrawerOpenStateFalse,
  } = useBoolean(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const queryClient = useQueryClient();
  const { data: currentMerchantData } = useGetMerchantMeQuery();
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  const { colorModeCookieValue, setColorModeCookieValue, colorCookieValue } =
    useCookieContext();

  const getStripeBillingSessionMutationMe = useMutation({
    mutationFn: async (returnUrl: string) => {
      return await new MerchantsApi(
        sessionedApiConfiguration
      ).getStripeBillingSessionMe({ returnUrl });
    },
  });

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const isMerchantSetup = isMerchantSetupFn(currentMerchantData);

  const menuItems: Array<ReactNode> = [,];

  if (currentMerchantData) {
    menuItems.push(
      <MenuItem
        key="account-menu-item"
        onClick={() => {
          push(routes.account);
          handleCloseUserMenu();
        }}
      >
        <ListItemIcon>
          <AccountCircleOutlined fontSize="small" />
        </ListItemIcon>
        <ListItemText>{t("account")}</ListItemText>
      </MenuItem>
    );
  }

  if (currentMerchantData?.stripeId) {
    menuItems.push(
      <MenuItem
        key="manage-account-menu-item"
        onClick={async () => {
          const response = await getStripeBillingSessionMutationMe.mutateAsync(
            window.location.href
          );
          if (response.data?.url) {
            push(response.data.url);
          }
          handleCloseUserMenu();
        }}
      >
        <ListItemIcon>
          <Payment />
        </ListItemIcon>
        <ListItemText primary={t("billing")} />
      </MenuItem>
    );
  }

  if (currentMerchantData) {
    menuItems.push(
      <MenuItem
        key="sign-out-menu-item"
        onClick={async () => {
          queryClient.invalidateQueries();
          await signOut({ callbackUrl: routes.login });
          handleCloseUserMenu();
        }}
      >
        <ListItemIcon>
          <Logout fontSize="small" style={{ transform: "scaleX(-1)" }} />
        </ListItemIcon>
        <ListItemText>{t("logOut")}</ListItemText>
      </MenuItem>
    );
  }

  menuItems.push([
    <MenuItem key="color-mode-menu-item" disableRipple>
      <ToggleButtonGroup
        value={colorModeCookieValue}
        exclusive
        onChange={(event, value: string | null) => {
          if (value === "system" || value === "dark" || value === "light") {
            setColorModeCookieValue(value);
          }
        }}
        aria-label="text alignment"
        size="small"
      >
        <ToggleButton value="light" aria-label="light">
          <LightMode />
        </ToggleButton>
        <ToggleButton value="system" aria-label="system">
          <Brightness6 />
        </ToggleButton>
        <ToggleButton value="dark" aria-label="dark">
          <DarkMode />
        </ToggleButton>
      </ToggleButtonGroup>
    </MenuItem>,
  ]);

  const appBarToolbar: ReactNode = (
    <Toolbar>
      <Box>
        <IconButton
          onClick={toggleDrawerOpenState}
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <MoaLink href={routes.dashboard} underline="none" color="inherit">
        <Typography variant="h6" component="div">
          {moaEnv.name}
        </Typography>
      </MoaLink>
      {moaEnv.isBeta && (
        <Chip label={t("beta")} color="warning" size="small" sx={{ ml: 1 }} />
      )}

      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 0 }}>
        {currentMerchantData && (
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar
              sx={{
                bgcolor:
                  colorCookieValue ||
                  stringToColor(fullNameForMerchant(currentMerchantData)),
              }}
            >
              {initialsForMerchant(currentMerchantData)}
            </Avatar>
          </IconButton>
        )}

        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {menuItems}
        </Menu>
      </Box>
    </Toolbar>
  );

  return (
    <Box sx={{ display: "flex", overflow: "hidden" }}>
      <AdaptiveAppBar position="fixed" open={drawerOpenState}>
        {appBarToolbar}
      </AdaptiveAppBar>
      <AdaptiveDrawer
        variant={isSmallScreen || !isMerchantSetup ? "temporary" : "permanent"}
        open={drawerOpenState}
        onClose={() => {
          setDrawerOpenStateFalse();
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawerOpenState}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <List sx={{ pt: 0 }}>
          <Fragment>
            {isMerchantSetup && (
              <Fragment>
                <ListItem key={"home-list-item"} disablePadding>
                  <ListItemButton
                    selected={pathname === routes.dashboard}
                    onClick={() => {
                      push(routes.dashboard);
                      if (isSmallScreen) {
                        setDrawerOpenStateFalse();
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Tooltip
                        title={!drawerOpenState ? t("dashboard") : undefined}
                        placement="right"
                      >
                        <Dashboard />
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText primary={t("dashboard")} />
                  </ListItemButton>
                </ListItem>
                <ListItem key={"catalog-list-item"} disablePadding>
                  <ListItemButton
                    selected={pathname === routes.catalog}
                    onClick={() => {
                      push(routes.catalog);
                      if (isSmallScreen) {
                        setDrawerOpenStateFalse();
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Tooltip
                        title={!drawerOpenState ? t("catalog") : undefined}
                        placement="right"
                      >
                        <MenuBook />
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText primary={t("catalog")} />
                  </ListItemButton>
                </ListItem>
                <ListItem key={"orders-list-item"} disablePadding>
                  <ListItemButton
                    selected={pathname === routes.orders}
                    onClick={() => {
                      push(routes.orders);
                      if (isSmallScreen) {
                        setDrawerOpenStateFalse();
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Tooltip
                        title={!drawerOpenState ? t("orders") : undefined}
                        placement="right"
                      >
                        <ListAlt />
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText primary={t("orders")} />
                  </ListItemButton>
                </ListItem>
                <ListItem key={"locations-list-item"} disablePadding>
                  <ListItemButton
                    selected={pathname === routes.locations}
                    onClick={() => {
                      push(routes.locations);
                      if (isSmallScreen) {
                        setDrawerOpenStateFalse();
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Tooltip
                        title={!drawerOpenState ? t("locations") : undefined}
                        placement="right"
                      >
                        <Store />
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText primary={t("locations")} />
                  </ListItemButton>
                </ListItem>
                <ListItem key={"customers-list-item"} disablePadding>
                  <ListItemButton
                    selected={pathname === routes.customers}
                    onClick={() => {
                      push(routes.customers);
                      if (isSmallScreen) {
                        setDrawerOpenStateFalse();
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Tooltip
                        title={!drawerOpenState ? t("customers") : undefined}
                        placement="right"
                      >
                        <Group />
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText primary={t("customers")} />
                  </ListItemButton>
                </ListItem>
                <ListItem key={"app-configurator-list-item"} disablePadding>
                  <ListItemButton
                    selected={pathname === routes.theme}
                    onClick={() => {
                      push(routes.theme);
                      if (isSmallScreen) {
                        setDrawerOpenStateFalse();
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Tooltip
                        title={!drawerOpenState ? t("theme") : undefined}
                        placement="right"
                      >
                        <AppShortcut />
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText primary={t("theme")} />
                  </ListItemButton>
                </ListItem>

                <ListItem key={"support-list-item"} disablePadding>
                  <ListItemButton
                    selected={pathname === routes.support}
                    onClick={() => {
                      push(routes.support);
                      if (isSmallScreen) {
                        setDrawerOpenStateFalse();
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Tooltip
                        title={!drawerOpenState ? t("support") : undefined}
                        placement="right"
                      >
                        <SupportAgent />
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText primary={t("support")} />
                  </ListItemButton>
                </ListItem>
                <ListItem key={"view-myorderapp-list-item"} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      window.open(currentMerchantMoaUrl, "_blank");
                      if (isSmallScreen) {
                        setDrawerOpenStateFalse();
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Tooltip
                        title={
                          !drawerOpenState ? t("useMyOrderApp") : undefined
                        }
                        placement="right"
                      >
                        <Web />
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText primary={t("useMyOrderApp")} />
                  </ListItemButton>
                </ListItem>
              </Fragment>
            )}

            <ListItem key={"home-list-item"} disablePadding>
              <ListItemButton
                onClick={() => {
                  window.open(moaEnv.marketingUrl);
                  if (isSmallScreen) {
                    setDrawerOpenStateFalse();
                  }
                }}
              >
                <ListItemIcon>
                  <Tooltip
                    title={!drawerOpenState ? t("mainSite") : undefined}
                    placement="right"
                  >
                    <ArrowBack />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary={t("mainSite")} />
              </ListItemButton>
            </ListItem>
          </Fragment>
        </List>
      </AdaptiveDrawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflow: "auto",
          height: isSmallScreen ? "inherit" : `calc(100vh)`,
        }}
      >
        <Box
          sx={{
            mt: `${appBarHeight}px`,
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            {props.children}
          </LocalizationProvider>
        </Box>
        <Box
          sx={{
            borderTop: "1px",
            borderTopStyle: "solid",
            borderTopColor: "divider",
          }}
        >
          <FooterComponent />
        </Box>
      </Box>
    </Box>
  );
}
