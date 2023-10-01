"use client";

import { routes } from "@/app/routes";
import { useCookieContext } from "@/contexts/CookieContext";
import { useGetCustomersQuery } from "@/queries/useGetCustomersQuery";
import { useGetOrderStatisticsMeQuery } from "@/queries/useGetOrderStatisticsMeQuery";
import { useGetOrdersQuery } from "@/queries/useGetOrdersQuery";
import { useRedirectSetupSessions } from "@/routing/useRedirectSetupSessions";
import { Person, Receipt } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { subDays } from "date-fns";
import { useFormatter, useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { Fragment, useState } from "react";

export default function Page() {
  useRedirectSetupSessions();

  const { push } = useRouter();
  const formatter = useFormatter();
  const common = useTranslations("Common");
  const t = useTranslations("HomePage");

  const { currencyCookieValue } = useCookieContext();

  const [startDateState, setStartDateState] = useState<Date>(
    subDays(new Date(), 30)
  );
  const [endDateState, setEndDateState] = useState<Date>(new Date());

  const { data: orderStatisticsData } = useGetOrderStatisticsMeQuery({
    startDate: startDateState.toISOString(),
    endDate: endDateState.toISOString(),
  });

  const { data: ordersData } = useGetOrdersQuery({
    page: 1,
    pageSize: 6,
  });
  const orders = ordersData?.data ?? [];

  const { data: customersData } = useGetCustomersQuery({
    page: 1,
    pageSize: 6,
    sort: "ASC",
  });
  const customers = customersData?.data ?? [];

  return (
    <Fragment>
      <Stack direction="row" spacing={2} pt={3} pb={2}>
        <DatePicker
          label={t("startDatePickerLabel")}
          value={startDateState}
          onChange={(newValue) => {
            newValue && setStartDateState(newValue);
          }}
        />
        <DatePicker
          label={t("endDatePickerLabel")}
          value={endDateState}
          onChange={(newValue) => {
            newValue && setEndDateState(newValue);
          }}
        />
      </Stack>
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t("moneyAmountSumLabel")}
              </Typography>
              <Typography variant="h3">
                {currencyCookieValue &&
                  formatter.number(
                    (orderStatisticsData?.moneyAmountSum ?? 0) / 100,
                    {
                      style: "currency",
                      currency: currencyCookieValue,
                      trailingZeroDisplay: "stripIfInteger",
                    }
                  )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t("moneyTaxAmountSumLabel")}
              </Typography>
              <Typography variant="h3">
                {currencyCookieValue &&
                  formatter.number(
                    (orderStatisticsData?.moneyTaxAmountSum ?? 0) / 100,
                    {
                      style: "currency",
                      currency: currencyCookieValue,
                      trailingZeroDisplay: "stripIfInteger",
                    }
                  )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t("moneyTipAmountSumLabel")}
              </Typography>
              <Typography variant="h3">
                {currencyCookieValue &&
                  formatter.number(
                    (orderStatisticsData?.moneyTipAmountSum ?? 0) / 100,
                    {
                      style: "currency",
                      currency: currencyCookieValue,
                      trailingZeroDisplay: "stripIfInteger",
                    }
                  )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t("moneyAppFeeAmountSumLabel")}
              </Typography>
              <Typography variant="h3">
                {currencyCookieValue &&
                  formatter.number(
                    (orderStatisticsData?.moneyAppFeeAmountSum ?? 0) / 100,
                    {
                      style: "currency",
                      currency: currencyCookieValue,
                      trailingZeroDisplay: "stripIfInteger",
                    }
                  )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h5">{t("recentOrdersLabel")}</Typography>
          <List>
            {orders.map((order) => (
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Receipt />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`Order #${order.displayId}`}
                  secondary={`${formatter.number(
                    (order?.totalMoneyAmount ?? 0) / 100,
                    {
                      style: "currency",
                      currency: order.currency ?? currencyCookieValue,
                      trailingZeroDisplay: "stripIfInteger",
                    }
                  )}`}
                />
              </ListItem>
            ))}
          </List>
          <Button onClick={() => push(routes.orders)}>
            {common("seeMore")}
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h5">{t("recentCustomersLabel")}</Typography>
          <List>
            {customers.map((customer) => (
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Person />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={customer.user?.fullName ?? customer.user?.email}
                  secondary={
                    customer.createDate &&
                    new Date(customer.createDate!).toLocaleDateString()
                  }
                />
              </ListItem>
            ))}
          </List>
          <Button onClick={() => push(routes.customers)}>
            {common("seeMore")}
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
}
