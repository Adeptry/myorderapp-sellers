import { useCurrentMerchantQuery } from "@/queries/useCurrentMerchantQuery";
import { toMoaAppUrl } from "./toMoaAppUrl";

export function useCurrentMerchantMoaUrl(): string | undefined {
  const { data } = useCurrentMerchantQuery();

  if (data?.appConfig?.path != undefined) {
    return toMoaAppUrl(data?.appConfig?.path);
  } else {
    return undefined;
  }
}
