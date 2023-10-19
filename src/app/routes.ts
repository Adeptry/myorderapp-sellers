export const routes = {
  index: "/",
  login: "/login",
  register: "/register",
  resetPassword: {
    index: "/reset-password",
    confirm: "/reset-password/confirm",
  },
  dashboard: "/dashboard",
  comingSoon: "/coming-soon",
  maintenance: "/maintenance",
  account: "/account",
  theme: "/theme",
  catalog: "/catalog",
  customers: "/customers",
  locations: "/locations",
  orders: "/orders",
  support: "/support",
  setup: {
    index: "/setup",
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
