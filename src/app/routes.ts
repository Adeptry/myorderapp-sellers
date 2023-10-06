export const routes = {
  index: "/",
  login: "/login",
  register: "/register",
  resetPassword: "/reset-password",
  dashboard: "/dashboard",
  account: "/account",
  theme: "/theme",
  catalog: "/catalog",
  customers: "/customers",
  locations: "/locations",
  orders: "/orders",
  support: "/support",
  setup: {
    theme: "/setup/theme",
    catalog: "/setup/catalog",
    square: {
      index: "/setup/square",
      sync: "/setup/square/sync",
    },
    plan: "/setup/plan",
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
