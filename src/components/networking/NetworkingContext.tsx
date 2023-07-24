import {
  AuthApi,
  CatalogsApi,
  ConfigsApi,
  LocationsApi,
  LoginResponseType,
  MerchantsApi,
  SquareApi,
} from "moa-merchants-ts-axios";
import { createContext } from "react";

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

export const NetworkingContext = createContext<
  NetworkingContextType | undefined
>(undefined);
