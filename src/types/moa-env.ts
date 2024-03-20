/*
    This code is part of the myorderapp-sellers front-end.
    Copyright (C) 2024  Adeptry, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

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
