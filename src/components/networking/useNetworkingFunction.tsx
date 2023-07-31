import axios, { AxiosError, AxiosResponse } from "axios";
import { useCallback } from "react";
import { NetworkingFunction } from "./NetworkingFunction";
import { useNetworkingContext } from "./useNetworkingContext";
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
  const { auth, setSession, session } = useNetworkingContext();

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
          throw new Error("No response from networking function");
        }

        setRequestState({
          data: response?.data,
          loading: false,
          error: undefined,
        });

        return response;
      } catch (error) {
        console.log(`Attempting to refresh token...`);
        if (axios.isAxiosError(error) && error.response?.status == 401) {
          if (session?.refreshToken) {
            console.log(`Can attempt to refresh token...`);
            try {
              const refreshTokenResponse = await auth.refreshToken({
                headers: {
                  Authorization: `Bearer ${session?.refreshToken}`,
                },
              });
              const refreshTokenData = refreshTokenResponse.data;
              if (refreshTokenData) {
                setSession(refreshTokenData);

                try {
                  const response = await networkingFunction(requestParameters, {
                    headers: {
                      Authorization: `Bearer ${refreshTokenData.token}`,
                    },
                  });

                  if (!response) {
                    throw new Error("No response from networking function");
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
              } else {
                console.log(`Failed refreshing token`);
                setRequestState({
                  data: undefined,
                  loading: false,
                  error: axios.isAxiosError(error) ? error : undefined,
                });
                setSession(null);
                throw error;
              }
            } catch (error) {
              console.log(`Failed refreshing token`);
              setRequestState({
                data: undefined,
                loading: false,
                error: axios.isAxiosError(error) ? error : undefined,
              });
              setSession(null);
              throw error;
            }
          } else {
            setSession(null);
            setRequestState({
              data: undefined,
              loading: false,
              error: undefined,
            });
            throw error;
          }
        } else {
          console.log(`Can't attempt to refresh token`);
          setRequestState({
            data: undefined,
            loading: false,
            error: axios.isAxiosError(error) ? error : undefined,
          });
          throw error;
        }
      }
    },
    [networkingFunction, setRequestState, setSession, auth, session] // depends on the `networkingFunction` prop
  );

  return [requestState, invoke];
};
