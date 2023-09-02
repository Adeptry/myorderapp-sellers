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
    free: {
      complete: "/setup/free/complete",
    },
  },
};
