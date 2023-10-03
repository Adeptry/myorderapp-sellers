import { useGetMerchantMeQuery } from "@/queries/useGetMerchantMeQuery";
import { NumberFormatOptions, useFormatter } from "next-intl";

export function useMerchantCurrencyFormatter() {
  const { number } = useFormatter();
  const { data: merchantMe } = useGetMerchantMeQuery();
  const formatOptions: NumberFormatOptions = {
    style: "currency",
    currency: merchantMe?.currencyCode ?? "USD",
  };

  const currencyFormatter = (moneyAmount: number) => {
    return number(moneyAmount, formatOptions);
  };

  return { currencyFormatter };
}
