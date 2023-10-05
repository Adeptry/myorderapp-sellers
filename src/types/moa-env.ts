export interface MoaEnv {
  frontendUrl: string;
  backendUrl: string;
  backendApiKey: string;
  appUrl: string;
  env: string;
  name: string;
  shortName: string;
  description: string;
  appConfig: {
    defaultFontFamily: string;
  };
  square: {
    scope: string;
    baseUrl: string;
    clientId: string;
    testCode: string;
  };
  google: { measurementId: string };
  theme: {
    typography: {
      fontFamily: string;
    };
    palette: {
      light: {
        primary: {
          main: string;
          light: string;
          dark: string;
        };
        secondary: {
          main: string;
          light: string;
          dark: string;
        };
      };
      dark: {
        primary: {
          main: string;
          light: string;
          dark: string;
        };
        secondary: {
          main: string;
          light: string;
          dark: string;
        };
      };
    };
  };
  stripe: {
    publishableKey: string;
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
