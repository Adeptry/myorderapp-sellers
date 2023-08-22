"use client";

import {
  NetworkingContext,
  NetworkingContextType,
} from "@/contexts/networking/NetworkingContext";
import { useSessionContext } from "@/contexts/session/useSessionContext";
import globalAxios from "axios";
import {
  AuthApi,
  CatalogsApi,
  ConfigsApi,
  Configuration,
  LocationsApi,
  MerchantsApi,
} from "moa-merchants-ts-axios";
import React, { useEffect, useState } from "react";

export function NetworkingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useSessionContext();

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
  });

  useEffect(() => {
    setApiContext({
      auth: new AuthApi(configuration, basePath, globalAxios),
      catalogs: new CatalogsApi(configuration, basePath, globalAxios),
      configs: new ConfigsApi(configuration, basePath, globalAxios),
      locations: new LocationsApi(configuration, basePath, globalAxios),
      merchants: new MerchantsApi(configuration, basePath, globalAxios),
    });
  }, [session]);

  return (
    <NetworkingContext.Provider value={apiContext}>
      {children}
    </NetworkingContext.Provider>
  );
}
