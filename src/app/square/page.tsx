"use client";

import { useNetworkingContext } from "@/components/NetworkingProvider";
import useRequestState from "@/utils/useRequestState";
import { Button, Container } from "@mui/material";
import axios from "axios";
import { Merchant } from "moa-merchants-ts-axios";
import { default as NextLink } from "next/link";
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
  const buildSquareUrl = (merchantId: string) => {
    const squareScope = [
      "MERCHANT_PROFILE_READ",
      "CUSTOMERS_WRITE",
      "CUSTOMERS_READ",
      "ORDERS_WRITE",
      "ORDERS_READ",
      "PAYMENTS_READ",
      "PAYMENTS_WRITE",
      "PAYMENTS_WRITE_ADDITIONAL_RECIPIENTS",
      "ITEMS_WRITE",
      "ITEMS_READ",
    ];
    const urlString = `${
      process.env.NEXT_PUBLIC_SQUARE_BASE_URL
    }/oauth2/authorize?client_id=${
      process.env.NEXT_PUBLIC_SQUARE_CLIENT_ID
    }&scope=${squareScope.join("+")}&state=${merchantId}`;
    return urlString;
  };

  return (
    <Container component="main">
      <Button
        href={buildSquareUrl(data?.id || "")}
        component={NextLink}
        variant="contained"
      >
        Authorize Square
      </Button>
    </Container>
  );
}
