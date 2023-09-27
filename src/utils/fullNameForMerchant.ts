import { MerchantEntity } from "myorderapp-square";

export function fullNameForMerchant(merchant?: MerchantEntity) {
  const currentUser = merchant?.user;
  const firstName = currentUser?.firstName;
  const lastName = currentUser?.lastName;
  const fullName = `${firstName ?? ""} ${lastName ?? ""}`;
  return fullName;
}
