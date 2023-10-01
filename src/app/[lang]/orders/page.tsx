"use client";

import { useGetOrdersQuery } from "@/queries/useGetOrdersQuery";
import { useRedirectSetupSessions } from "@/routing/useRedirectSetupSessions";
import { Stack } from "@mui/material";
import { DataGrid, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

export default function Page() {
  useRedirectSetupSessions();

  const common = useTranslations("Common");
  const formatter = useFormatter();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 12,
  });

  const [sortModel, setGridSortModel] = useState<GridSortModel>([
    { field: "closedDate", sort: "asc" },
  ]);

  const { data } = useGetOrdersQuery({
    page: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
  });

  return (
    <Stack spacing={2} py={3}>
      <DataGrid
        rowCount={data?.count ?? 0}
        rows={
          data?.data?.map((order) => {
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
                  currency: order.currency ?? "USD",
                }
              ),
            };
          }) ?? []
        }
        columns={[
          {
            field: "id",
            headerName: "ID",
            flex: 1,
            sortable: false,
            filterable: false,
          },
          {
            field: "closedDate",
            headerName: common("closedDate"),
            flex: 1,
            sortable: false,
            filterable: false,
          },
          {
            field: "location",
            headerName: common("location"),
            flex: 1,
            sortable: false,
            filterable: false,
          },
          {
            field: "customer",
            headerName: common("customer"),
            flex: 1,
            sortable: false,
            filterable: false,
          },
          {
            field: "totalMoneyAmount",
            headerName: common("totalMoneyAmount"),
            flex: 1,
            sortable: false,
            filterable: false,
          },
        ]}
        isRowSelectable={() => false}
        paginationMode="server"
        pageSizeOptions={[12, 24, 48]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={(sortModel) => {
          console.log(sortModel);
          setGridSortModel(sortModel);
        }}
      />
    </Stack>
  );
}
