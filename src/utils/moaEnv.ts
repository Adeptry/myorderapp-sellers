import { MoaEnv } from "@/types/moa-env";

export const moaEnv: MoaEnv = {
  env: process.env.NEXT_PUBLIC_ENV!,
  frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL!,
  appUrl: process.env.NEXT_PUBLIC_APP_URL!,
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL!,
  backendApiKey: process.env.NEXT_PUBLIC_BACKEND_API_KEY!,
  name: process.env.NEXT_PUBLIC_NAME!,
  shortName: process.env.NEXT_PUBLIC_SHORT_NAME!,
  description: process.env.NEXT_PUBLIC_DESCRIPTION!,
  appConfig: {
    defaultFontFamily: process.env.NEXT_PUBLIC_APP_CONFIG_DEFAULT_FONT_FAMILY!,
  },
  square: {
    scope: process.env.NEXT_PUBLIC_SQUARE_SCOPE!,
    baseUrl: process.env.NEXT_PUBLIC_SQUARE_BASE_URL!,
    clientId: process.env.NEXT_PUBLIC_SQUARE_CLIENT_ID!,
    testCode: process.env.NEXT_PUBLIC_SQUARE_TEST_CODE!,
  },
  google: { measurementId: process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID! },
  theme: {
    typography: {
      fontFamily:
        process.env.NEXT_PUBLIC_THEME_TYPOGRAPHY_FONT_FAMILY_CSS_STRING!,
    },
    palette: {
      light: {
        primary: {
          main: process.env.NEXT_PUBLIC_THEME_PALETTE_LIGHT_PRIMARY_MAIN!,
          dark: process.env.NEXT_PUBLIC_THEME_PALETTE_LIGHT_PRIMARY_DARK!,
          light: process.env.NEXT_PUBLIC_THEME_PALETTE_LIGHT_PRIMARY_LIGHT!,
        },
        secondary: {
          main: process.env.NEXT_PUBLIC_THEME_PALETTE_LIGHT_SECONDARY_MAIN!,
          dark: process.env.NEXT_PUBLIC_THEME_PALETTE_LIGHT_SECONDARY_DARK!,
          light: process.env.NEXT_PUBLIC_THEME_PALETTE_LIGHT_SECONDARY_LIGHT!,
        },
      },
      dark: {
        primary: {
          main: process.env.NEXT_PUBLIC_THEME_PALETTE_DARK_PRIMARY_MAIN!,
          dark: process.env.NEXT_PUBLIC_THEME_PALETTE_DARK_PRIMARY_DARK!,
          light: process.env.NEXT_PUBLIC_THEME_PALETTE_DARK_PRIMARY_LIGHT!,
        },
        secondary: {
          main: process.env.NEXT_PUBLIC_THEME_PALETTE_DARK_SECONDARY_MAIN!,
          dark: process.env.NEXT_PUBLIC_THEME_PALETTE_DARK_SECONDARY_DARK!,
          light: process.env.NEXT_PUBLIC_THEME_PALETTE_DARK_SECONDARY_LIGHT!,
        },
      },
    },
  },
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    priceIds: [
      {
        usd: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TIER_0_USD!,
        eur: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TIER_0_EUR!,
        gbp: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TIER_0_GBP!,
        jpy: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TIER_0_JPY!,
        cad: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TIER_0_CAD!,
        aud: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TIER_0_AUD!,
      },
      {
        usd: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TIER_1_USD!,
        eur: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TIER_1_EUR!,
        gbp: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TIER_1_GBP!,
        jpy: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TIER_1_JPY!,
        cad: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TIER_1_CAD!,
        aud: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TIER_1_AUD!,
      },
      {
        usd: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TIER_2_USD!,
        eur: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TIER_2_EUR!,
        gbp: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TIER_2_GBP!,
        jpy: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TIER_2_JPY!,
        cad: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TIER_2_CAD!,
        aud: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TIER_2_AUD!,
      },
    ],
  },
};
