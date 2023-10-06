import { MoaEnv } from "@/types/moa-env";
import { ColorSchemeEnum } from "next/dist/lib/metadata/types/metadata-types";

export const moaEnv: MoaEnv = {
  env: process.env.NEXT_PUBLIC_ENV!,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL!,
  appUrl: process.env.NEXT_PUBLIC_APP_URL!,
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL!,
  backendApiKey: process.env.NEXT_PUBLIC_BACKEND_API_KEY!,

  comingSoon: process.env.NEXT_PUBLIC_COMING_SOON === "true",
  maintenance: process.env.NEXT_PUBLIC_MAINTENANCE === "true",

  // manifest, loosely
  name: process.env.NEXT_PUBLIC_NAME!,
  shortName: process.env.NEXT_PUBLIC_SHORT_NAME!,
  abbreviation: process.env.NEXT_PUBLIC_ABBREVIATION!,
  description: process.env.NEXT_PUBLIC_DESCRIPTION!,

  metadata: {
    robots: process.env.NEXT_PUBLIC_METADATA_ROBOTS!,
    colorScheme: process.env
      .NEXT_PUBLIC_METADATA_COLOR_SCHEME! as ColorSchemeEnum,
    viewport: process.env.NEXT_PUBLIC_METADATA_VIEWPORT!,
  },

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
    prices: [
      {
        usd: Number(process.env.NEXT_PUBLIC_STRIPE_PRICE_TIER_0_USD!),
        eur: Number(process.env.NEXT_PUBLIC_STRIPE_PRICE_TIER_0_EUR!),
        gbp: Number(process.env.NEXT_PUBLIC_STRIPE_PRICE_TIER_0_GBP!),
        jpy: Number(process.env.NEXT_PUBLIC_STRIPE_PRICE_TIER_0_JPY!),
        cad: Number(process.env.NEXT_PUBLIC_STRIPE_PRICE_TIER_0_CAD!),
        aud: Number(process.env.NEXT_PUBLIC_STRIPE_PRICE_TIER_0_AUD!),
      },
      {
        usd: Number(process.env.NEXT_PUBLIC_STRIPE_PRICE_TIER_1_USD!),
        eur: Number(process.env.NEXT_PUBLIC_STRIPE_PRICE_TIER_1_EUR!),
        gbp: Number(process.env.NEXT_PUBLIC_STRIPE_PRICE_TIER_1_GBP!),
        jpy: Number(process.env.NEXT_PUBLIC_STRIPE_PRICE_TIER_1_JPY!),
        cad: Number(process.env.NEXT_PUBLIC_STRIPE_PRICE_TIER_1_CAD!),
        aud: Number(process.env.NEXT_PUBLIC_STRIPE_PRICE_TIER_1_AUD!),
      },
      {
        usd: Number(process.env.NEXT_PUBLIC_STRIPE_PRICE_TIER_2_USD!),
        eur: Number(process.env.NEXT_PUBLIC_STRIPE_PRICE_TIER_2_EUR!),
        gbp: Number(process.env.NEXT_PUBLIC_STRIPE_PRICE_TIER_2_GBP!),
        jpy: Number(process.env.NEXT_PUBLIC_STRIPE_PRICE_TIER_2_JPY!),
        cad: Number(process.env.NEXT_PUBLIC_STRIPE_PRICE_TIER_2_CAD!),
        aud: Number(process.env.NEXT_PUBLIC_STRIPE_PRICE_TIER_2_AUD!),
      },
    ],
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