"use client";

import { useCurrentMerchant } from "@/components/CurrentMerchantProvider";

export default function Page() {
  const { merchant } = useCurrentMerchant();
  return <div>Hello, {merchant?.id}</div>;
}
