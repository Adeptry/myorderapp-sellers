import { AxiosRequestConfig, AxiosResponse } from "axios";

export type NetworkingFunctionP<T, R> = (
  requestParameters: T,
  options: AxiosRequestConfig
) => Promise<AxiosResponse<R, any>>;
