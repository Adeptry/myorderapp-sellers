import { MerchantEntity } from "myorderapp-square";

export function isMerchantSetupFn(merchant?: MerchantEntity) {
  return (
    merchant?.appConfig != null &&
    merchant?.squareId != null &&
    // merchant?.catalogId != null &&
    merchant?.tier != null
  );
}
