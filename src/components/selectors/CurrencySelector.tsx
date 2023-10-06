import { Currency } from "@/types/next";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useCookieContext } from "../providers/CookieContext";

export function CurrencySelector() {
  const t = useTranslations("CurrencySelector");
  const { currencyCookieValue, setCurrencyCookieValue } = useCookieContext();

  if (currencyCookieValue === undefined) {
    return <Skeleton height="40px" width="100px" />;
  } else {
    return (
      <FormControl variant="outlined" size="small">
        <InputLabel id="currency-selector-label">{t("title")}</InputLabel>
        <Select
          labelId="currency-selector-label"
          value={currencyCookieValue}
          onChange={(event) =>
            setCurrencyCookieValue(event.target.value as Currency)
          }
          label={t("title")}
        >
          <MenuItem value="usd">🇺🇸 USD</MenuItem>
          <MenuItem value="eur">🇪🇺 EUR</MenuItem>
          <MenuItem value="gbp">🇬🇧 GBP</MenuItem>
          <MenuItem value="jpy">🇯🇵 JPY</MenuItem>
          <MenuItem value="cad">🇨🇦 CAD</MenuItem>
          <MenuItem value="aud">🇦🇺 AUD</MenuItem>
        </Select>
      </FormControl>
    );
  }
}
