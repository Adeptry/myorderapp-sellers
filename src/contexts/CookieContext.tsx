"use client";

import { constants } from "@/constants";
import { getCookie, setCookie } from "cookies-next";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface CookieContextProps {
  currencyCookieValue: string | undefined;
  setCurrencyCookieValue: (currency: string | undefined) => void;
}

export const CookieContext = createContext<CookieContextProps | undefined>(
  undefined
);

interface CookieProviderProps {
  children: ReactNode;
}

export function CookieProvider({ children }: CookieProviderProps) {
  const [currencyState, setCurrencyState] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const initialCurrency = getCookie(constants.currencyCookieName);
    setCurrencyState(initialCurrency);
  }, []);

  useEffect(() => {
    if (currencyState !== undefined) {
      const currentCurrencyCookieValue = getCookie(
        constants.currencyCookieName
      );
      if (currentCurrencyCookieValue !== currencyState) {
        setCookie(constants.currencyCookieName, currencyState);
      }
    }
  }, [currencyState]);

  return (
    <CookieContext.Provider
      value={{
        currencyCookieValue: currencyState,
        setCurrencyCookieValue: setCurrencyState,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
}

export function useCookieContext() {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error("useCookieContext must be used within a CookieProvider");
  }
  return context;
}
