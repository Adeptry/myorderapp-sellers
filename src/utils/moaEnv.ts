import { MoaEnv } from "@/types/moa-env";

export const moaEnv: MoaEnv = {
  env: process.env.NEXT_PUBLIC_ENV!,
  frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL!,
  appUrl: process.env.NEXT_PUBLIC_APP_URL!,
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL!,
  backendApiKey: process.env.NEXT_PUBLIC_BACKEND_API_KEY!,
  squareScope: process.env.NEXT_PUBLIC_SQUARE_SCOPE!,
  squareBaseUrl: process.env.NEXT_PUBLIC_SQUARE_BASE_URL!,
  squareClientId: process.env.NEXT_PUBLIC_SQUARE_CLIENT_ID!,
  squareTestCode: process.env.NEXT_PUBLIC_SQUARE_TEST_CODE!,
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
  defaultFontFamily: process.env.NEXT_PUBLIC_DEFAULT_FONT_FAMILY!,
  stripe: {
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
