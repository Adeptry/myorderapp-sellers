"use client";

import { StatisticsCard } from "@/components/cards/StatisticsCard";
import { CustomersDataGrid } from "@/components/data-grids/CustomersDataGrid";
import { OrdersDataGrid } from "@/components/data-grids/OrdersDataGrid";
import { useGetOrderStatisticsMeQuery } from "@/networking/queries/useGetOrderStatisticsMeQuery";
import { useRedirectNotSetupSessions } from "@/routing/useRedirectNotSetupSessions";
import {
  useHeaderAndFooterHeight,
  useMaxHeightCssString,
} from "@/utils/useMaxHeight";
import { useMerchantCurrencyFormatter } from "@/utils/useMerchantCurrencyFormatter";
import { InfoOutlined } from "@mui/icons-material";
import {
  Box,
  Card,
  CardHeader,
  Container,
  Grid,
  Skeleton,
  Stack,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";
import { DatePicker } from "@mui/x-date-pickers";
import { endOfMonth, startOfMonth } from "date-fns";
import { useTranslations } from "next-intl";
import { useState } from "react";
import OrderingEnabledFormControlLabel from "../form-control-labels/OrderingEnabledFormControlLabel";

const headerHeight = 151 + 16 + 56 + 16 + 46; // 46 is a magic number

export function DashboardComponent() {
  useRedirectNotSetupSessions();

  const maxHeightCssString = useMaxHeightCssString();

  const t = useTranslations("DashboardComponent");

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const headerAndFooterHeight = useHeaderAndFooterHeight();
  const dataGridHeightCssString = `calc(100vh - ${headerHeight}px - ${headerAndFooterHeight}px)`;

  const { currencyFormatter } = useMerchantCurrencyFormatter();

  const [startDateState, setStartDateState] = useState<Date>(
    startOfMonth(new Date())
  );
  const [endDateState, setEndDateState] = useState<Date>(
    endOfMonth(new Date())
  );

  const { data: orderStatisticsData, isLoading: orderStatisticsLoading } =
    useGetOrderStatisticsMeQuery({
      startDate: startDateState.toISOString(),
      endDate: endDateState.toISOString(),
    });

  return (
    <Container sx={{ minHeight: maxHeightCssString, py: 2 }} maxWidth={false}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <DatePicker
            sx={{ width: "100%" }}
            label={t("startDatePickerLabel")}
            value={startDateState}
            onChange={(newValue) => {
              newValue && setStartDateState(newValue);
            }}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <DatePicker
            sx={{ width: "100%" }}
            label={t("endDatePickerLabel")}
            value={endDateState}
            onChange={(newValue) => {
              newValue && setEndDateState(newValue);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ height: "56px" }}>
            <CardHeader
              sx={{ paddingY: "12px" }}
              action={
                <Tooltip title={t("orderCountTooltip")}>
                  <InfoOutlined />
                </Tooltip>
              }
              title={
                orderStatisticsLoading ? (
                  <Skeleton />
                ) : (
                  t("orderCountTitle", {
                    count: orderStatisticsData?.count ?? 0,
                  })
                )
              }
            />
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Stack direction="row" justifyContent="center" alignItems="center">
              <OrderingEnabledFormControlLabel />
              <Tooltip title={t("appConfigEnabledTooltip")}>
                <InfoOutlined />
              </Tooltip>
            </Stack>
          </Box>
        </Grid>

        <Grid container item xs={12} spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <StatisticsCard
              title={t("moneyAmountLabel")}
              tooltipTitle={t("moneyAmountTooltip")}
              loading={orderStatisticsLoading}
              sum={currencyFormatter(
                (orderStatisticsData?.moneyAmount?.sum ?? 0) / 100
              )}
              average={currencyFormatter(
                (orderStatisticsData?.moneyAmount?.average ?? 0) / 100
              )}
              maximum={currencyFormatter(
                (orderStatisticsData?.moneyAmount?.maximum ?? 0) / 100
              )}
              minimum={currencyFormatter(
                (orderStatisticsData?.moneyAmount?.minimum ?? 0) / 100
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatisticsCard
              title={t("moneyTaxAmountLabel")}
              tooltipTitle={t("moneyTaxAmountTooltip")}
              loading={orderStatisticsLoading}
              sum={currencyFormatter(
                (orderStatisticsData?.taxMoneyAmount?.sum ?? 0) / 100
              )}
              average={currencyFormatter(
                (orderStatisticsData?.taxMoneyAmount?.average ?? 0) / 100
              )}
              maximum={currencyFormatter(
                (orderStatisticsData?.taxMoneyAmount?.maximum ?? 0) / 100
              )}
              minimum={currencyFormatter(
                (orderStatisticsData?.taxMoneyAmount?.minimum ?? 0) / 100
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatisticsCard
              title={t("moneyTipAmountLabel")}
              tooltipTitle={t("moneyTipAmountTooltip")}
              loading={orderStatisticsLoading}
              sum={currencyFormatter(
                (orderStatisticsData?.tipMoneyAmount?.sum ?? 0) / 100
              )}
              average={currencyFormatter(
                (orderStatisticsData?.tipMoneyAmount?.average ?? 0) / 100
              )}
              maximum={currencyFormatter(
                (orderStatisticsData?.tipMoneyAmount?.maximum ?? 0) / 100
              )}
              minimum={currencyFormatter(
                (orderStatisticsData?.tipMoneyAmount?.minimum ?? 0) / 100
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatisticsCard
              title={t("moneyAppFeeAmountLabel")}
              tooltipTitle={t("moneyAppFeeAmountTooltip")}
              loading={orderStatisticsLoading}
              sum={currencyFormatter(
                (orderStatisticsData?.appFeeMoneyAmount?.sum ?? 0) / 100
              )}
              average={currencyFormatter(
                (orderStatisticsData?.appFeeMoneyAmount?.average ?? 0) / 100
              )}
              maximum={currencyFormatter(
                (orderStatisticsData?.appFeeMoneyAmount?.maximum ?? 0) / 100
              )}
              minimum={currencyFormatter(
                (orderStatisticsData?.appFeeMoneyAmount?.minimum ?? 0) / 100
              )}
            />
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            height={isMdUp ? dataGridHeightCssString : "439px"}
          >
            <OrdersDataGrid
              initialPageSize={6}
              autoPageSize={isMdUp}
              startDate={startDateState}
              endDate={endDateState}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            height={isMdUp ? dataGridHeightCssString : "439px"}
          >
            <CustomersDataGrid
              initialPageSize={6}
              autoPageSize={isMdUp}
              startDate={startDateState}
              endDate={endDateState}
            />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
