import { Merchant } from "moa-merchants-ts-axios";

export function initialsForMerchant(merchant?: Merchant) {
  const currentUser = merchant?.user;
  const firstName = currentUser?.firstName;
  const lastName = currentUser?.lastName;
  const initials = `${firstName ? firstName[0] : ""}${
    lastName ? lastName[0] : ""
  }`;
  return initials;
}
