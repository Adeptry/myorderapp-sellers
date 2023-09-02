import { Merchant } from "moa-merchants-ts-axios";

export function fullNameForMerchant(merchant?: Merchant) {
  const currentUser = merchant?.user;
  const firstName = currentUser?.firstName;
  const lastName = currentUser?.lastName;
  const fullName = `${firstName ?? ""} ${lastName ?? ""}`;
  return fullName;
}
