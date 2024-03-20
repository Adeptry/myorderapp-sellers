/*
    This code is part of the myorderapp-sellers front-end.
    Copyright (C) 2024  Adeptry, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

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
