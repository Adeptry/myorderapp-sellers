import axios, { AxiosError, AxiosResponse } from "axios";
import { useCallback } from "react";
import { NetworkingFunction } from "./NetworkingFunction";
import { useRequestState } from "./useRequestState";

type UseNetworkingHookResponse<R> = {
  data: R | undefined;
  loading: boolean;
  error?: AxiosError;
};

export const useNetworkingFunction = <T, R>(
  networkingFunction: NetworkingFunction<T, R>,
  initialLoading?: boolean
): [
  UseNetworkingHookResponse<R>,
  (requestParameters: T) => Promise<AxiosResponse<R, any>>
] => {
  const [requestState, setRequestState] = useRequestState<R>({
    loading: initialLoading ?? false,
  });

  const invoke = useCallback(
    async (requestParameters: T): Promise<AxiosResponse<R, any>> => {
      try {
        setRequestState({
          data: undefined,
          loading: true,
          error: undefined,
        });

        const response = await networkingFunction(requestParameters);

        if (!response) {
          throw new Error("No access token");
        }

        setRequestState({
          data: response?.data,
          loading: false,
          error: undefined,
        });

        return response;
      } catch (error) {
        setRequestState({
          data: undefined,
          loading: false,
          error: axios.isAxiosError(error) ? error : undefined,
        });
        throw error;
      }
    },
    [networkingFunction] // depends on the `networkingFunction` prop
  );

  return [requestState, invoke];
};
