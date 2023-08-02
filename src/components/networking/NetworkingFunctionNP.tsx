import { AxiosRequestConfig, AxiosResponse } from "axios";

export type NetworkingFunctionNP<R> = (
  options: AxiosRequestConfig
) => Promise<AxiosResponse<R, any>>;
