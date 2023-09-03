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
  colorModeCookieValue: "light" | "dark" | "system";
  setColorModeCookieValue: (colorMode: "light" | "dark" | "system") => void;
  colorCookieValue: string | undefined;
  setColorCookieValue: (color: string) => void;
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

  const [colorModeState, setColorModeState] = useState<
    "light" | "dark" | "system"
  >("light");

  const [colorState, setColorState] = useState<string | undefined>(undefined);

  useEffect(() => {
    setCurrencyState(getCookie(constants.currencyCookieName));

    const colorMode = getCookie(constants.colorModeCookieName);
    if (colorMode === "dark" || colorMode === "system") {
      setColorModeState(colorMode);
    } else {
      setColorModeState("light");
    }

    setColorState(getCookie(constants.colorCookieName));
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

  useEffect(() => {
    if (colorModeState !== undefined) {
      const currentCurrencyCookieValue = getCookie(
        constants.colorModeCookieName
      );
      if (currentCurrencyCookieValue !== colorModeState) {
        setCookie(constants.colorModeCookieName, colorModeState);
      }
    }
  }, [colorModeState]);

  useEffect(() => {
    if (colorState !== undefined) {
      const currentCurrencyCookieValue = getCookie(constants.colorCookieName);
      if (currentCurrencyCookieValue !== colorState) {
        setCookie(constants.colorCookieName, colorState);
      }
    }
  }, [colorState]);

  return (
    <CookieContext.Provider
      value={{
        currencyCookieValue: currencyState,
        setCurrencyCookieValue: setCurrencyState,
        colorModeCookieValue: colorModeState,
        setColorModeCookieValue: setColorModeState,
        colorCookieValue: colorState,
        setColorCookieValue: setColorState,
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
