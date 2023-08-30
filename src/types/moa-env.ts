export interface MoaEnv {
  frontendUrl: string;
  backendUrl: string;
  squareScope: string;
  squareBaseUrl: string;
  squareClientId: string;
  squareTestCode: string;
  stripePublishableKey: string;
  googleClientId: string;
  backendApiKey: string;
  previewUrl: string;
  env: string;
}

export interface MoaConstants {
  currencyCookieName: string;
  currencyToPriceDictionary: { [key: string]: number };
}
