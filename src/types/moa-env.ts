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
  appUrl: string;
  env: string;
  defaultFontFamily: string;
  stripe: {
    priceIds: {
      usd: string;
      eur: string;
      gbp: string;
      jpy: string;
      cad: string;
      aud: string;
    }[];
  };
}

export interface MoaConstants {
  currencyCookieName: string;
  colorModeCookieName: string;
  colorCookieName: string;
  currencyToPriceDictionaries: { [key: string]: number }[];
}
