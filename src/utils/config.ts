import { MoaEnv } from "types/moa-env";

export const moaEnv: MoaEnv = {
  env: process.env.NEXT_PUBLIC_ENV!,
  frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL!,
  previewUrl: process.env.NEXT_PUBLIC_PREVIEW_URL!,
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL!,
  backendApiKey: process.env.NEXT_PUBLIC_BACKEND_API_KEY!,
  squareScope: process.env.NEXT_PUBLIC_SQUARE_SCOPE!,
  squareBaseUrl: process.env.NEXT_PUBLIC_SQUARE_BASE_URL!,
  squareClientId: process.env.NEXT_PUBLIC_SQUARE_CLIENT_ID!,
  squareTestCode: process.env.NEXT_PUBLIC_SQUARE_TEST_CODE!,
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
};
