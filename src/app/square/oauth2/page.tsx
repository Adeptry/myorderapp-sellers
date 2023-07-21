"use client";

import { routes } from "@/app/routes";
import { useNetworkingContext } from "@/components/NetworkingProvider";
import useRequestState from "@/utils/useRequestState";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const oauthAccessCode = searchParams.get("code");
  const { merchants } = useNetworkingContext();

  const [{ loading, error }, setRequestState] = useRequestState<void>({
    loading: true,
  });

  useEffect(() => {
    async function fetch() {
      try {
        if (oauthAccessCode) {
          const response = await merchants.confirmSquareOauth({
            oauthAccessCode,
          });
          setRequestState({
            data: response?.data,
            loading: false,
            error: undefined,
          });
        }
      } catch (error) {
        setRequestState({
          data: undefined,
          loading: false,
          error: axios.isAxiosError(error) ? error.response?.data : error,
        });
      }
    }

    fetch();
  }, [oauthAccessCode]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  push(routes.stripe);

  return <div>Success!</div>;
}
