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
  defaultFontFamily: string;
  stripe: {
    priceIds: {
      pro: {
        usd: string;
        eur: string;
        gbp: string;
        jpy: string;
        cad: string;
        aud: string;
      };
      free: {
        usd: string;
        eur: string;
        gbp: string;
        jpy: string;
        cad: string;
        aud: string;
      };
    };
  };
}

export interface MoaConstants {
  currencyCookieName: string;
  currencyToPriceDictionary: { [key: string]: number };
}
