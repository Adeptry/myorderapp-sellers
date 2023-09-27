import { MerchantEntity } from "myorderapp-square";

export function initialsForMerchant(merchant?: MerchantEntity) {
  const currentUser = merchant?.user;
  const firstName = currentUser?.firstName;
  const lastName = currentUser?.lastName;
  const initials = `${firstName ? firstName[0] : ""}${
    lastName ? lastName[0] : ""
  }`;
  return initials;
}
