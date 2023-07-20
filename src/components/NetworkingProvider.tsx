"use client";

import globalAxios from "axios";
import {
  AuthApi,
  CatalogsApi,
  ConfigsApi,
  Configuration,
  LocationsApi,
  LoginResponseType,
  MerchantsApi,
  SquareApi,
} from "moa-merchants-ts-axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

export type NetworkingContextType = {
  auth: AuthApi;
  catalogs: CatalogsApi;
  configs: ConfigsApi;
  locations: LocationsApi;
  merchants: MerchantsApi;
  square: SquareApi;
  session: LoginResponseType | null;
  setSession: (value: LoginResponseType | null) => void;
};

const NetworkingContext = createContext<NetworkingContextType | undefined>(
  undefined
);

export function NetworkingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useLocalStorage<LoginResponseType | null>(
    "session",
    null
  );
  const configuration = new Configuration({
    accessToken: session?.token,
  });
  const basePath = process.env.NEXT_PUBLIC_BACKEND_DOMAIN;

  const [apiContext, setApiContext] = useState<NetworkingContextType>({
    auth: new AuthApi(configuration, basePath, globalAxios),
    catalogs: new CatalogsApi(configuration, basePath, globalAxios),
    configs: new ConfigsApi(configuration, basePath, globalAxios),
    locations: new LocationsApi(configuration, basePath, globalAxios),
    merchants: new MerchantsApi(configuration, basePath, globalAxios),
    square: new SquareApi(configuration, basePath, globalAxios),
    session,
    setSession,
  });

  useEffect(() => {
    setApiContext({
      auth: new AuthApi(configuration, basePath, globalAxios),
      catalogs: new CatalogsApi(configuration, basePath, globalAxios),
      configs: new ConfigsApi(configuration, basePath, globalAxios),
      locations: new LocationsApi(configuration, basePath, globalAxios),
      merchants: new MerchantsApi(configuration, basePath, globalAxios),
      square: new SquareApi(configuration, basePath, globalAxios),
      session,
      setSession,
    });
  }, [session]);

  return (
    <NetworkingContext.Provider value={apiContext}>
      {children}
    </NetworkingContext.Provider>
  );
}

export const useNetworkingContext = () => {
  const context = useContext(NetworkingContext);

  if (context === undefined) {
    throw new Error(
      "useNetworkingContext must be used within a NetworkingProvider"
    );
  }

  return context;
};
