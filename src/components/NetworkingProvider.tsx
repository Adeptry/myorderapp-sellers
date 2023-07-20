"use client";

import useAccessToken from "@/utils/useAccessToken";
import {
  AuthApi,
  CatalogsApi,
  ConfigApi,
  Configuration,
  LocationsApi,
  MerchantApi,
  SquareApi,
} from "moa-merchants-ts-axios";
import React, { createContext, useContext } from "react";

export type NetworkingContext = {
  auth: AuthApi;
  catalogs: CatalogsApi;
  config: ConfigApi;
  locations: LocationsApi;
  merchants: MerchantApi;
  square: SquareApi;
};

const NetworkingContext = createContext<NetworkingContext | undefined>(
  undefined
);

export function NetworkingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [accessToken] = useAccessToken();

  const configuration = new Configuration({
    accessToken: accessToken ?? undefined,
  });

  const apiContext: NetworkingContext = {
    auth: new AuthApi(configuration),
    catalogs: new CatalogsApi(configuration),
    config: new ConfigApi(configuration),
    locations: new LocationsApi(configuration),
    merchants: new MerchantApi(configuration),
    square: new SquareApi(configuration),
  };

  return (
    <NetworkingContext.Provider value={apiContext}>
      {children}
    </NetworkingContext.Provider>
  );
}

export const useNetworkingContext = () => useContext(NetworkingContext);
