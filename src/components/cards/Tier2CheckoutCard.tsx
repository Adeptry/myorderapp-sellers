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

import { StripeCheckoutButton } from "@/components/buttons/StripeCheckoutButton";
import { moaEnv } from "@/moaEnv";
import { Currency } from "@/types/next";
import { Apple } from "@mui/icons-material";
import SupportAgent from "@mui/icons-material/SupportAgent";
import { useCookieContext } from "../providers/CookieContext";

import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useFormatter, useTranslations } from "next-intl";

export function Tier2CheckoutCard() {
  const formatter = useFormatter();
  const t = useTranslations("Tier2CheckoutCard");
  const { currencyCookieValue } = useCookieContext();

  return (
    <Card>
      <CardHeader
        title={t("title")}
        subheader={t("subheader")}
        titleTypographyProps={{ align: "center" }}
        subheaderTypographyProps={{
          align: "center",
        }}
        action={<Apple />}
        sx={{ pb: 0 }}
      />
      <CardContent style={{ paddingBottom: 8 }}>
        <Stack alignItems={"center"} sx={{ mb: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
            }}
          >
            <Typography component="h2" variant="h3" color="text.primary">
              {currencyCookieValue &&
                formatter.number(
                  moaEnv.stripe.prices[2][currencyCookieValue as Currency],
                  {
                    style: "currency",
                    currency: currencyCookieValue,
                    trailingZeroDisplay: "stripIfInteger",
                  }
                )}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {t("perMonth")}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {t("transactionFee")}
          </Typography>
        </Stack>
        <CardActions>
          <StripeCheckoutButton fullWidth tier={2} text={t("buttonText")} />
        </CardActions>
        <Typography variant="h6" color="text.secondary" mt={2}>
          {t("perfectForHeader")}
        </Typography>
        <Typography variant="body2" color="text.primary" mt={1}>
          {t("perfectForBody")}
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemIcon>
              <SupportAgent />
            </ListItemIcon>
            <ListItemText
              primary={t("supportPrimary")}
              secondary={t("supportSecondary")}
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}
