import { useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { useNetworkingContext } from "./useNetworkingContext";

export const useCurrentMerchantQuery = (options?: AxiosRequestConfig) => {
  const { merchants } = useNetworkingContext();

  return useQuery(["getCurrentMerchant"], () =>
    merchants.getCurrentMerchant(options)
  );
};
