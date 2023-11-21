export interface MoaEnv {
  siteUrl: string;
  backendUrl: string;
  backendApiKey: string;
  appUrl: string;
  appUserAgent: string;
  marketingUrl: string;
  termsUrl: string;
  privacyUrl: string;
  faqUrl: string;
  gdprUrl: string;
  env: string;
  name: string;
  isBeta: boolean;
  shortName: string;
  abbreviation: string;
  description: string;
  comingSoon: boolean;
  maintenance: boolean;
  metadata: {
    robots: string;
  };
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
    prices: {
      usd: number;
      eur: number;
      gbp: number;
      jpy: number;
      cad: number;
      aud: number;
    }[];
    priceIds: {
      usd?: string;
      eur?: string;
      gbp?: string;
      jpy?: string;
      cad?: string;
      aud?: string;
    }[];
  };
}

export interface MoaConstants {
  currencyCookieName: string;
  colorModeCookieName: string;
  colorCookieName: string;
  squareCsrfTokenCookieName: string;
}
