import { Merchant } from "moa-merchants-ts-axios";

export function isMerchantSetupFn(merchant?: Merchant) {
  return (
    merchant?.appConfig != null &&
    merchant?.squareId != null &&
    // merchant?.catalogId != null &&
    merchant?.tier != null
  );
}
