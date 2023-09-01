"use client";

import { routes } from "@/app/routes";
import { FooterLayout } from "@/components/layouts/FooterLayout";
import { useCurrentMerchantQuery } from "@/queries/useCurrentMerchantQuery";
import { stringToColor } from "@/utils/stringToColor";
import { useAppBarHeight } from "@/utils/useAppBarHeight";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import {
  AccountBox,
  AppShortcut,
  ArrowBack,
  Logout,
  MenuBook,
  Menu as MenuIcon,
  Payment,
} from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  Avatar,
  Box,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useMutation } from "@tanstack/react-query";
import {
  MerchantsApiFp,
  StripeBillingPortalCreateInput,
} from "moa-merchants-ts-axios";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { Fragment, ReactNode, useState } from "react";
import { useBoolean } from "usehooks-ts";
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

export function MoaAdaptiveScaffold(props: { children: ReactNode }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const common = useTranslations("Common");
  const appBarHeight = useAppBarHeight();
  const maxHeightCssString = useMaxHeightCssString();
  const { push } = useRouter();
  const {
    value: drawerOpenState,
    toggle: toggleDrawerOpenState,
    setFalse: setDrawerOpenStateFalse,
  } = useBoolean(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const { status } = useSession();
  const { data: currentMerchantData } = useCurrentMerchantQuery();
  const sessionedApiConfiguration = useSessionedApiConfiguration();

  const createStripeBillingSessionUrlMutation = useMutation({
    mutationFn: async (
      stripeBillingPortalCreateInput: StripeBillingPortalCreateInput
    ) => {
      return (
        await MerchantsApiFp(
          sessionedApiConfiguration
        ).createStripeBillingSessionUrl(stripeBillingPortalCreateInput)
      )();
    },
  });

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const currentUser = currentMerchantData?.user;
  const firstName = currentUser?.firstName;
  const lastName = currentUser?.lastName;
  const fullName = `${firstName ?? ""} ${lastName ?? ""}`;
  const initials = `${firstName ? firstName[0] : ""}${
    lastName ? lastName[0] : ""
  }`;
  const showSideMenu = currentMerchantData?.tier !== undefined;

  const menuItems: Array<ReactNode> = [];

  if (currentMerchantData) {
    menuItems.push(
      <MenuItem
        key="account-menu-item"
        onClick={() => {
          signOut({ callbackUrl: routes.login });
        }}
      >
        <ListItemIcon>
          <AccountBox fontSize="small" />
        </ListItemIcon>
        <ListItemText>{common("profile")}</ListItemText>
      </MenuItem>
    );
  }

  if (currentMerchantData?.stripeId) {
    menuItems.push(
      <MenuItem
        key="manage-account-menu-item"
        onClick={async () => {
          const response =
            await createStripeBillingSessionUrlMutation.mutateAsync({
              returnUrl: window.location.href,
            });
          if (response.data?.url) {
            push(response.data.url);
          }
        }}
      >
        <ListItemIcon>
          <Payment />
        </ListItemIcon>
        <ListItemText primary={common("billing")} />
      </MenuItem>
    );
  }

  if (currentMerchantData) {
    menuItems.push(
      <MenuItem
        key="sign-out-menu-item"
        onClick={() => {
          signOut({ callbackUrl: routes.login });
        }}
      >
        <ListItemIcon>
          <Logout fontSize="small" style={{ transform: "scaleX(-1)" }} />
        </ListItemIcon>
        <ListItemText>{common("logOut")}</ListItemText>
      </MenuItem>
    );
  }
  const skeleton = status === "loading";
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
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        {common("brandNameLong")}
      </Typography>

      <Box sx={{ flexGrow: 0 }}>
        {skeleton && <Skeleton height="40px" width="40px" variant="circular" />}
        {currentMerchantData && (
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar
              sx={{
                bgcolor: stringToColor(fullName),
              }}
            >
              {initials}
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
        variant={isSmallScreen ? "temporary" : "permanent"}
        open={drawerOpenState}
        onClose={(event) => {
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
        <List>
          <Fragment>
            {showSideMenu && (
              <Fragment>
                <ListItem key={"catalog-list-item"} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      push(routes.catalog);
                      if (isSmallScreen) {
                        setDrawerOpenStateFalse();
                      }
                    }}
                  >
                    <ListItemIcon>
                      <MenuBook />
                    </ListItemIcon>
                    <ListItemText primary={common("catalog")} />
                  </ListItemButton>
                </ListItem>
                <ListItem key={"app-configurator-list-item"} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      push(routes.theme);
                      if (isSmallScreen) {
                        setDrawerOpenStateFalse();
                      }
                    }}
                  >
                    <ListItemIcon>
                      <AppShortcut />
                    </ListItemIcon>
                    <ListItemText primary={common("theme")} />
                  </ListItemButton>
                </ListItem>
              </Fragment>
            )}

            <ListItem key={"home-list-item"} disablePadding>
              <ListItemButton
                onClick={() => {
                  if (isSmallScreen) {
                    setDrawerOpenStateFalse();
                  }
                }}
              >
                <ListItemIcon>
                  <ArrowBack />
                </ListItemIcon>
                <ListItemText primary={common("mainSite")} />
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
        <Container
          sx={{
            minHeight: maxHeightCssString,
            mt: `${appBarHeight}px`,
          }}
        >
          {props.children}
        </Container>
        <Box
          sx={{
            borderTop: "1px",
            borderTopStyle: "solid",
            borderTopColor: "divider",
          }}
        >
          <FooterLayout />
        </Box>
      </Box>
    </Box>
  );
}
