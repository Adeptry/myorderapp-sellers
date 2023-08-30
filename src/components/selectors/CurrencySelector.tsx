"use client";

import { useCookieContext } from "@/contexts/CookieContext";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
} from "@mui/material";
import { useTranslations } from "next-intl";

export function CurrencySelector() {
  const common = useTranslations("Common");
  const { currencyCookieValue, setCurrencyCookieValue } = useCookieContext();

  if (currencyCookieValue === undefined) {
    return <Skeleton height="40px" width="100px" />;
  } else {
    return (
      <FormControl variant="outlined" size="small">
        <InputLabel id="currency-selector-label">
          {common("currency")}
        </InputLabel>
        <Select
          labelId="currency-selector-label"
          value={currencyCookieValue}
          onChange={(event) =>
            setCurrencyCookieValue(event.target.value as string)
          }
          label={common("currency")}
        >
          <MenuItem value="USD">🇺🇸 USD</MenuItem>
          <MenuItem value="EUR">🇪🇺 EUR</MenuItem>
          <MenuItem value="GBP">🇬🇧 GBP</MenuItem>
          <MenuItem value="JPY">🇯🇵 JPY</MenuItem>
          <MenuItem value="CAD">🇨🇦 CAD</MenuItem>
          <MenuItem value="AUD">🇦🇺 AUD</MenuItem>
        </Select>
      </FormControl>
    );
  }
}
