import { useGetMerchantMeQuery } from "@/queries/useGetMerchantMeQuery";
import { useGetOrdersQuery } from "@/queries/useGetOrdersQuery";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { GetOrdersOrderFieldEnum } from "myorderapp-square";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

export function OrdersDataGrid(props: {
  autoPageSize?: boolean | undefined;
  initialPageSize?: number | undefined;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
}) {
  const { autoPageSize, initialPageSize, startDate, endDate } = props;
  const t = useTranslations("OrdersDataGrid");
  const formatter = useFormatter();
  const { data: merchantMe } = useGetMerchantMeQuery();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: initialPageSize ?? 6,
  });

  const [sortModel, setGridSortModel] = useState<GridSortModel>([
    { field: "closedDate", sort: "desc" },
  ]);

  const { data: getOrdersResponse, isLoading: getOrdersIsLoading } =
    useGetOrdersQuery({
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      startDate,
      endDate,
      sort:
        sortModel.length > 0
          ? sortModel[0].sort === "asc"
            ? "ASC"
            : "DESC"
          : undefined,
      field:
        sortModel.length > 0
          ? (sortModel[0].field as GetOrdersOrderFieldEnum)
          : undefined,
    });

  const noDataOverlay = (
    <Box
      display={"flex"}
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Typography>{t("noData")}</Typography>
    </Box>
  );

  return (
    <DataGrid
      rowCount={getOrdersResponse?.count ?? 0}
      isRowSelectable={() => false}
      autoPageSize={autoPageSize}
      loading={getOrdersIsLoading}
      paginationMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      sortingMode="server"
      sortModel={sortModel}
      onSortModelChange={setGridSortModel}
      slots={{
        noRowsOverlay: () => noDataOverlay,
        noResultsOverlay: () => noDataOverlay,
      }}
      columns={[
        {
          field: "id",
          headerName: t("idHeaderName"),
          flex: 1,
          sortable: false,
          filterable: false,
          minWidth: 100,
        },
        {
          field: "closedDate",
          headerName: t("closedDateHeaderName"),
          flex: 1,
          sortable: true,
          filterable: false,
          minWidth: 125,
        },

        {
          field: "totalMoneyAmount",
          headerName: t("totalMoneyAmountHeaderName"),
          flex: 1,
          sortable: false,
          filterable: false,
          minWidth: 100,
        },
        {
          field: "customer",
          headerName: t("customerHeaderName"),
          flex: 1,
          sortable: false,
          filterable: false,
          minWidth: 200,
        },
        {
          field: "location",
          headerName: t("locationHeaderName"),
          flex: 1,
          sortable: false,
          filterable: false,
          minWidth: 200,
        },
      ]}
      rows={
        getOrdersResponse?.data?.map((order) => {
          return {
            id: order.displayId,
            closedDate: new Date(
              order.closedDate ?? new Date()
            ).toLocaleDateString(),
            location: order.location?.name,
            lastName: order.squareFulfillmentStatus,
            customer:
              order.customer?.user?.fullName ?? order.customer?.user?.email,
            totalMoneyAmount: formatter.number(
              (order.totalMoneyAmount ?? 0) / 100,
              {
                style: "currency",
                currency: merchantMe?.currencyCode ?? "USD",
              }
            ),
          };
        }) ?? []
      }
    />
  );
}
