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
import React, { useEffect, useState } from "react";
import { useIsClient, useLocalStorage } from "usehooks-ts";
import { NetworkingContext, NetworkingContextType } from "./NetworkingContext";

export function NetworkingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useLocalStorage<LoginResponseType | null>(
    "session",
    null
  );
  const isClient = useIsClient();

  const configuration = new Configuration({
    accessToken: session?.token,
    apiKey: process.env.NEXT_PUBLIC_BACKEND_API_KEY,
  });
  const basePath = process.env.NEXT_PUBLIC_BACKEND_DOMAIN;

  const [apiContext, setApiContext] = useState<NetworkingContextType>({
    auth: new AuthApi(configuration, basePath, globalAxios),
    catalogs: new CatalogsApi(configuration, basePath, globalAxios),
    configs: new ConfigsApi(configuration, basePath, globalAxios),
    locations: new LocationsApi(configuration, basePath, globalAxios),
    merchants: new MerchantsApi(configuration, basePath, globalAxios),
    square: new SquareApi(configuration, basePath, globalAxios),
    session: isClient ? session : null,
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
      session: isClient ? session : null,
      setSession,
    });
  }, [session]);

  return (
    <NetworkingContext.Provider value={apiContext}>
      {children}
    </NetworkingContext.Provider>
  );
}
