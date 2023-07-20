"use client";

import useAccessToken from "@/utils/useAccessToken";
import useRequestState from "@/utils/useRequestState";
import axios from "axios";
import { Merchant } from "moa-merchants-ts-axios";
import React, { createContext, useContext, useEffect } from "react";
import { useNetworkingContext } from "./NetworkingProvider";

export type CurrentMerchantContextType = {
  merchant?: Merchant;
  loading: boolean;
  error?: any;
};

const CurrentMerchantContext = createContext<
  CurrentMerchantContextType | undefined
>(undefined);

export function CurrentMerchantProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [accessToken] = useAccessToken();
  const { merchants } = useNetworkingContext();
  const [{ data: merchant, loading, error }, setRequestState] =
    useRequestState<Merchant>();

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        setRequestState({
          data: undefined,
          loading: true,
          error: undefined,
        });
        const response = await merchants.getCurrentMerchant();
        setRequestState({
          data: response.data,
          loading: false,
          error: undefined,
        });
      } catch (error) {
        setRequestState({
          data: undefined,
          loading: false,
          error: axios.isAxiosError(error) ? error : undefined,
        });
      }
    };

    fetchAuth();
  }, [accessToken]);

  const currentMerchantContext: CurrentMerchantContextType = {
    merchant,
    loading,
    error,
  };

  return (
    <CurrentMerchantContext.Provider value={currentMerchantContext}>
      {children}
    </CurrentMerchantContext.Provider>
  );
}

export const useCurrentMerchant = () => {
  const context = useContext(CurrentMerchantContext);

  if (context === undefined) {
    throw new Error(
      "useCurrentMerchantContext must be used within a CurrentMerchantProvider"
    );
  }

  return context;
};
