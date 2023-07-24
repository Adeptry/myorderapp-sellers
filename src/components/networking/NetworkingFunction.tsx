import { AxiosRequestConfig, AxiosResponse } from "axios";

export type NetworkingFunction<T, R> = (
  requestParameters: T,
  options?: AxiosRequestConfig
) => Promise<AxiosResponse<R, any>>;
