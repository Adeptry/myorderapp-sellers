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

import { useGetMerchantMeQuery } from "@/networking/queries/useGetMerchantMeQuery";
import { useGetOrdersQuery } from "@/networking/queries/useGetOrdersQuery";
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
      actingAs: "merchant",
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      customer: true,
      location: true,
      closed: true,
      orderSort:
        sortModel.length > 0
          ? sortModel[0].sort === "asc"
            ? "ASC"
            : "DESC"
          : undefined,
      orderField:
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
          field: "squareId",
          headerName: t("idHeaderName"),
          flex: 1,
          sortable: true,
          filterable: false,
          minWidth: 125,
        },
        {
          field: "closedDate",
          headerName: t("closedDateHeaderName"),
          flex: 1,
          sortable: true,
          filterable: false,
          minWidth: 150,
        },

        {
          field: "totalMoneyAmount",
          headerName: t("totalMoneyAmountHeaderName"),
          flex: 1,
          sortable: true,
          filterable: false,
          minWidth: 125,
        },
        {
          field: "customerId",
          headerName: t("customerHeaderName"),
          flex: 1,
          sortable: true,
          filterable: false,
          minWidth: 200,
        },
        {
          field: "locationId",
          headerName: t("locationHeaderName"),
          flex: 1,
          sortable: true,
          filterable: false,
          minWidth: 200,
        },
      ]}
      rows={
        getOrdersResponse?.data?.map((order) => {
          return {
            id: order.id,
            squareId: order.displayId,
            closedDate: new Date(
              order.closedDate ?? new Date()
            ).toLocaleDateString(),
            locationId: order.location?.name,
            lastName: order.squareFulfillmentStatus,
            customerId:
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
