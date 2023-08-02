import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useCallback } from "react";
import { NetworkingFunctionP } from "./NetworkingFunctionP";
import { useNetworkingContext } from "./useNetworkingContext";
import { useRequestState } from "./useRequestState";

type UseNetworkingHookResponse<R> = {
  data: R | undefined;
  loading: boolean;
  error?: AxiosError;
};

export const useNetworkingFunctionP = <T, R>(
  networkingFunction: NetworkingFunctionP<T, R>,
  initialLoading?: boolean
): [
  UseNetworkingHookResponse<R>,
  (
    requestParameters: T,
    options: AxiosRequestConfig
  ) => Promise<AxiosResponse<R, any>>
] => {
  const [requestState, setRequestState] = useRequestState<R>({
    loading: initialLoading ?? false,
  });
  const { auth, setSession, session } = useNetworkingContext();

  const resetState = (error?: AxiosError) => {
    setRequestState({
      data: undefined,
      loading: false,
      error,
    });
  };

  const executeRequest = async (
    params: T,
    options: AxiosRequestConfig
  ): Promise<AxiosResponse<R, any>> => {
    setRequestState({
      data: undefined,
      loading: true,
      error: undefined,
    });

    console.log(
      `Executing request with params: ${JSON.stringify(
        params
      )} and options: ${JSON.stringify(options)}`
    );

    const response = await networkingFunction(params, options);

    if (!response) throw new Error("No response from networking function");

    setRequestState({
      data: response.data,
      loading: false,
      error: undefined,
    });

    return response;
  };

  const invoke = useCallback(
    async (
      requestParameters: T,
      options: AxiosRequestConfig
    ): Promise<AxiosResponse<R, any>> => {
      try {
        return await executeRequest(requestParameters, options);
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response?.status === 401 &&
          session?.refreshToken
        ) {
          try {
            const refreshTokenResponse = await auth.refreshToken({
              headers: {
                Authorization: `Bearer ${session.refreshToken}`,
              },
            });

            const refreshTokenData = refreshTokenResponse.data;

            if (refreshTokenData) {
              setSession(refreshTokenData);
              return await executeRequest(requestParameters, {
                headers: {
                  Authorization: `Bearer ${refreshTokenData.token}`,
                },
              });
            } else {
              setSession(null);
              throw new Error("No refresh token data");
            }
          } catch (refreshError) {
            resetState(
              axios.isAxiosError(refreshError) ? refreshError : undefined
            );
            setSession(null);
            throw refreshError;
          }
        } else {
          resetState(axios.isAxiosError(error) ? error : undefined);
          throw error;
        }
      }
    },
    [networkingFunction, setRequestState, setSession, auth, session]
  );

  return [requestState, invoke];
};
