"use client";

import { routes } from "@/app/routes";
import { FooterLayout } from "@/components/layouts/FooterLayout";
import { stringToColor } from "@/utils/stringToColor";
import { useCurrentMerchantQuery } from "@/utils/useCurrentMerchantQuery";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import {
  AccountBox,
  AppShortcut,
  Home,
  Logout,
  MenuBook,
  Menu as MenuIcon,
  Payment,
} from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  Avatar,
  Box,
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
import Container from "@mui/material/Container";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useMutation } from "@tanstack/react-query";
import {
  MerchantsApiFp,
  StripeBillingPortalCreateInput,
} from "moa-merchants-ts-axios";
import { signOut } from "next-auth/react";
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

  const { push } = useRouter();
  const { value: drawerOpenState, toggle: toggleDrawerOpenState } =
    useBoolean(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const { data: currentMerchantData } = useCurrentMerchantQuery();
  const { configuration, status } = useSessionedApiConfiguration();

  const createStripeBillingSessionUrlMutation = useMutation({
    mutationFn: async (
      stripeBillingPortalCreateInput: StripeBillingPortalCreateInput
    ) => {
      return (
        await MerchantsApiFp(configuration).createStripeBillingSessionUrl(
          stripeBillingPortalCreateInput
        )
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
  const hasFinishedOnboarding =
    currentMerchantData?.catalogId &&
    currentMerchantData?.squareId &&
    currentMerchantData?.stripeId &&
    currentMerchantData?.stripeCheckoutSessionId;

  const menuItems: Array<ReactNode> = [];

  if (currentMerchantData) {
    menuItems.push(
      <MenuItem key="full-name-menu-item" disabled>
        <Typography variant="subtitle2">Hi, {fullName}!</Typography>
      </MenuItem>
    );
  }
  if (currentMerchantData) {
    menuItems.push(
      <MenuItem
        key="account-menu-item"
        onClick={() => {
          signOut({ callbackUrl: routes.signin });
        }}
      >
        <ListItemIcon>
          <AccountBox fontSize="small" />
        </ListItemIcon>
        <ListItemText>{common("account")}</ListItemText>
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
          signOut({ callbackUrl: routes.signin });
        }}
      >
        <ListItemIcon>
          <Logout fontSize="small" style={{ transform: "scaleX(-1)" }} />
        </ListItemIcon>
        <ListItemText>{common("signOut")}</ListItemText>
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
        MyOrderApp
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
    <Box sx={{ display: "flex" }}>
      <AdaptiveAppBar position="absolute" open={drawerOpenState}>
        {appBarToolbar}
      </AdaptiveAppBar>
      <AdaptiveDrawer
        variant={isSmallScreen ? "temporary" : "permanent"}
        open={drawerOpenState}
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
            {hasFinishedOnboarding && (
              <Fragment>
                <ListItem key={"catalog-list-item"} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      push(routes.catalog);
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
                      push(routes.appearance);
                    }}
                  >
                    <ListItemIcon>
                      <AppShortcut />
                    </ListItemIcon>
                    <ListItemText primary={common("appearance")} />
                  </ListItemButton>
                </ListItem>
              </Fragment>
            )}

            <ListItem key={"home-list-item"} disablePadding>
              <ListItemButton onClick={() => {}}>
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText primary={common("homepage")} />
              </ListItemButton>
            </ListItem>
          </Fragment>
        </List>
      </AdaptiveDrawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Container
          sx={{
            minHeight: "calc(100vh - 110px)",
            mt: "56px",
          }}
        >
          {props.children}
        </Container>
        <FooterLayout />
      </Box>
    </Box>
  );
}
