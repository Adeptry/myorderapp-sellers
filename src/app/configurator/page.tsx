"use client";

import { useNetworkingContext } from "@/components/NetworkingProvider";
import useRequestState from "@/utils/useRequestState";
import axios from "axios";
import { Merchant } from "moa-merchants-ts-axios";
import { useEffect } from "react";

export default function Page() {
  const { merchants } = useNetworkingContext();

  const [{ data, loading, error }, setRequestState] = useRequestState<Merchant>(
    { loading: true }
  );

  useEffect(() => {
    async function fetch() {
      try {
        const response = await merchants.getCurrentMerchant();
        setRequestState({
          data: response?.data,
          loading: false,
          error: undefined,
        });
      } catch (error) {
        setRequestState({
          data: undefined,
          loading: false,
          error: axios.isAxiosError(error) ? error.response?.data : error,
        });
      }
    }

    fetch();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  return <div>Hello, {data?.user?.firstName}</div>;
}
