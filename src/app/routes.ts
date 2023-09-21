export const routes = {
  index: "/",
  login: "/login",
  register: "/register",
  resetPassword: "/reset-password",
  home: "/home",
  profile: "/profile",
  theme: "/theme",
  catalog: "/catalog",
  customers: "/customers",
  orders: "/orders",
  support: "/support",
  setup: {
    theme: "/setup/theme",
    catalog: "/setup/catalog",
    square: {
      index: "/setup/square",
      oauth2: "/setup/square/oauth2",
    },
    tier: "/setup/tier",
    cancel: "/setup/cancel",
    pro: {
      complete: "/setup/pro/complete",
    },
    starter: {
      complete: "/setup/starter/complete",
    },
    free: {
      complete: "/setup/free/complete",
    },
  },
};
