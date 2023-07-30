export const routes = {
  signin: "/signin",
  signup: "/",
  forgot: "/forgot",
  home: "/home",
  onboarding: {
    configurator: "/onboarding/configurator",
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
  configurator: "/configurator",
};
