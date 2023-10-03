import { StatisticsCard } from "@/components/cards/StatisticsCard";
import { CustomersDataGrid } from "@/components/data-grids/CustomersDataGrid";
import { OrdersDataGrid } from "@/components/data-grids/OrdersDataGrid";
import { useGetOrderStatisticsMeQuery } from "@/queries/useGetOrderStatisticsMeQuery";
import { useHeaderAndFooterHeight } from "@/utils/useMaxHeight";
import { useMerchantCurrencyFormatter } from "@/utils/useMerchantCurrencyFormatter";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { subDays } from "date-fns";
import { useTranslations } from "next-intl";
import { useState } from "react";

const headerHeight = 151 + 16 + 56 + 16 + 46; // 46 is a magic number

export function Dashboard() {
  const t = useTranslations("Dashboard");

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const headerAndFooterHeight = useHeaderAndFooterHeight();
  const dataGridHeightCssString = `calc(100vh - ${headerHeight}px - ${headerAndFooterHeight}px)`;

  const { currencyFormatter } = useMerchantCurrencyFormatter();

  const [startDateState, setStartDateState] = useState<Date>(
    subDays(new Date(), 30)
  );
  const [endDateState, setEndDateState] = useState<Date>(new Date());

  const { data: orderStatisticsData, isLoading: orderStatisticsLoading } =
    useGetOrderStatisticsMeQuery({
      startDate: startDateState.toISOString(),
      endDate: endDateState.toISOString(),
    });
  return (
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
              (orderStatisticsData?.moneyTaxAmount?.sum ?? 0) / 100
            )}
            average={currencyFormatter(
              (orderStatisticsData?.moneyTaxAmount?.average ?? 0) / 100
            )}
            maximum={currencyFormatter(
              (orderStatisticsData?.moneyTaxAmount?.maximum ?? 0) / 100
            )}
            minimum={currencyFormatter(
              (orderStatisticsData?.moneyTaxAmount?.minimum ?? 0) / 100
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatisticsCard
            title={t("moneyTipAmountLabel")}
            tooltipTitle={t("moneyTipAmountTooltip")}
            loading={orderStatisticsLoading}
            sum={currencyFormatter(
              (orderStatisticsData?.moneyTipAmount?.sum ?? 0) / 100
            )}
            average={currencyFormatter(
              (orderStatisticsData?.moneyTipAmount?.average ?? 0) / 100
            )}
            maximum={currencyFormatter(
              (orderStatisticsData?.moneyTipAmount?.maximum ?? 0) / 100
            )}
            minimum={currencyFormatter(
              (orderStatisticsData?.moneyTipAmount?.minimum ?? 0) / 100
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatisticsCard
            title={t("moneyAppFeeAmountLabel")}
            tooltipTitle={t("moneyAppFeeAmountTooltip")}
            loading={orderStatisticsLoading}
            sum={currencyFormatter(
              (orderStatisticsData?.moneyAppFeeAmount?.sum ?? 0) / 100
            )}
            average={currencyFormatter(
              (orderStatisticsData?.moneyAppFeeAmount?.average ?? 0) / 100
            )}
            maximum={currencyFormatter(
              (orderStatisticsData?.moneyAppFeeAmount?.maximum ?? 0) / 100
            )}
            minimum={currencyFormatter(
              (orderStatisticsData?.moneyAppFeeAmount?.minimum ?? 0) / 100
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
          <OrdersDataGrid initialPageSize={6} autoPageSize={isMdUp} />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          height={isMdUp ? dataGridHeightCssString : "439px"}
        >
          <CustomersDataGrid initialPageSize={6} autoPageSize={isMdUp} />
        </Grid>
      </Grid>
    </Grid>
  );
}
