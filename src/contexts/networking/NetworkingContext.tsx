import {
  AuthApi,
  CatalogsApi,
  ConfigsApi,
  LocationsApi,
  MerchantsApi,
} from "moa-merchants-ts-axios";
import { createContext } from "react";

export type NetworkingContextType = {
  auth: AuthApi;
  catalogs: CatalogsApi;
  configs: ConfigsApi;
  locations: LocationsApi;
  merchants: MerchantsApi;
};

export const NetworkingContext = createContext<
  NetworkingContextType | undefined
>(undefined);
