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

"use client";

import { constants } from "@/constants";
import { Currency } from "@/types/next";
import { getCookie, setCookie } from "cookies-next";
import { nanoid } from "nanoid";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface CookieContextProps {
  currencyCookieValue: string | undefined;
  setCurrencyCookieValue: (currency: Currency | undefined) => void;
  colorModeCookieValue: "light" | "dark" | "system" | undefined;
  setColorModeCookieValue: (colorMode: "light" | "dark" | "system") => void;
  colorCookieValue: string | undefined;
  setColorCookieValue: (color: string) => void;
  squareCsrfTokenCookieValue: string | undefined;
  setNewSquareCsrfTokenCookieValue: () => void;
  isValidSquareCsrfToken: (squareCsrfToken: string) => boolean;
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
    "light" | "dark" | "system" | undefined
  >(undefined);

  const [colorState, setColorState] = useState<string | undefined>(undefined);
  const [squareCsrfTokenState, setSquareCsrfTokenState] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    setCurrencyState(getCookie(constants.currencyCookieName)?.toLowerCase());

    const colorMode = getCookie(constants.colorModeCookieName);
    if (
      colorMode === "dark" ||
      colorMode === "system" ||
      colorMode === "light"
    ) {
      setColorModeState(colorMode);
    } else {
      setCookie(constants.colorModeCookieName, "light");
      setColorModeState("light");
    }

    setColorState(getCookie(constants.colorCookieName));

    const squareCsrfTokenCookie = getCookie(
      constants.squareCsrfTokenCookieName
    );
    if (squareCsrfTokenCookie != undefined) {
      setSquareCsrfTokenState(squareCsrfTokenCookie);
    } else {
      const newSquareCsrfToken = nanoid();
      setCookie(constants.squareCsrfTokenCookieName, newSquareCsrfToken);
      setSquareCsrfTokenState(newSquareCsrfToken);
    }
  }, []);

  useEffect(() => {
    if (currencyState !== undefined) {
      const currentCurrencyCookieValue = getCookie(
        constants.currencyCookieName
      )?.toLowerCase();
      if (currentCurrencyCookieValue !== currencyState) {
        setCookie(constants.currencyCookieName, currencyState);
      }
    }
  }, [currencyState]);

  useEffect(() => {
    if (colorModeState !== undefined) {
      setCookie(constants.colorModeCookieName, colorModeState);
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
        squareCsrfTokenCookieValue: squareCsrfTokenState,
        setNewSquareCsrfTokenCookieValue: () => {
          const newSquareCsrfToken = nanoid();
          setCookie(constants.squareCsrfTokenCookieName, newSquareCsrfToken);
          setSquareCsrfTokenState(newSquareCsrfToken);
        },
        isValidSquareCsrfToken: (squareCsrfToken: string) => {
          return squareCsrfToken === squareCsrfTokenState;
        },
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
