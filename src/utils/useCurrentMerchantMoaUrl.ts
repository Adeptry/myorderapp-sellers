import { useGetMerchantMeQuery } from "@/queries/useGetMerchantMeQuery";
import { toMoaAppUrl } from "./toMoaAppUrl";

export function useCurrentMerchantMoaUrl(): string | undefined {
  const { data } = useGetMerchantMeQuery();

  if (data?.appConfig?.path != undefined) {
    return toMoaAppUrl(data?.appConfig?.path);
  } else {
    return undefined;
  }
}
