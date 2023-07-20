"use client";

import useAccessToken from "@/utils/useAccessToken";
import {
  AuthApi,
  CatalogsApi,
  ConfigsApi,
  Configuration,
  LocationsApi,
  MerchantsApi,
  SquareApi,
} from "moa-merchants-ts-axios";
import React, { createContext, useContext } from "react";

export type NetworkingContextType = {
  auth: AuthApi;
  catalogs: CatalogsApi;
  configs: ConfigsApi;
  locations: LocationsApi;
  merchants: MerchantsApi;
  square: SquareApi;
};

const NetworkingContext = createContext<NetworkingContextType | undefined>(
  undefined
);

export function NetworkingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [accessToken] = useAccessToken();
  console.log("accessToken", accessToken);

  const configuration = new Configuration({
    accessToken: accessToken ?? undefined,
  });

  const apiContext: NetworkingContextType = {
    auth: new AuthApi(configuration),
    catalogs: new CatalogsApi(configuration),
    configs: new ConfigsApi(configuration),
    locations: new LocationsApi(configuration),
    merchants: new MerchantsApi(configuration),
    square: new SquareApi(configuration),
  };

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
