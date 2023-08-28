export const routes = {
  signin: "/signin",
  signup: "/",
  forgot: "/forgot",
  dashboard: "/dashboard",
  account: "/account",
  appearance: "/appearance",
  catalog: "/catalog",
  onboarding: {
    appearance: "/onboarding/appearance",
    catalog: "/onboarding/catalog",
    square: {
      index: "/onboarding/square",
      oauth2: "/onboarding/square/oauth2",
    },
    stripe: {
      index: "/onboarding/stripe",
      cancel: "/onboarding/stripe/cancel",
      success: "/onboarding/stripe/success",
    },
  },
};
