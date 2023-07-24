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
import { useLocalStorage } from "usehooks-ts";
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
