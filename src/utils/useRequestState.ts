import { AxiosError } from "axios";
import { useState } from "react";

export default function useRequestState<S>() {
  return useState<{
    data: S | undefined;
    error: AxiosError | undefined;
    loading: boolean;
  }>({ data: undefined, error: undefined, loading: false });
}
