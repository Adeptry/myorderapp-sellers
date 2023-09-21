import { MoaConstants } from "./types/moa-env";

export const constants: MoaConstants = {
  currencyCookieName: "MOA_CURRENCY",
  colorModeCookieName: "MOA_COLOR_MODE",
  colorCookieName: "MOA_COLOR",
  currencyToPriceDictionaries: [
    {
      USD: 0,
      EUR: 0,
      GBP: 0,
      JPY: 0,
      CAD: 0,
      AUD: 0,
    },
    {
      USD: 29,
      EUR: 29,
      GBP: 19,
      JPY: 3200,
      CAD: 29,
      AUD: 29,
    },
    {
      USD: 99,
      EUR: 99,
      GBP: 79,
      JPY: 11800,
      CAD: 99,
      AUD: 99,
    },
  ],
};
