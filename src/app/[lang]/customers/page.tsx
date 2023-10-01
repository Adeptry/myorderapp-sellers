"use client";

import { useGetCustomersQuery } from "@/queries/useGetCustomersQuery";
import { useRedirectSetupSessions } from "@/routing/useRedirectSetupSessions";
import { Stack } from "@mui/material";
import { DataGrid, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { GetOrdersOrderSortEnum } from "myorderapp-square";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function Page() {
  useRedirectSetupSessions();

  const common = useTranslations("Common");

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 1,
    pageSize: 25,
  });

  const [sortModel, setGridSortModel] = useState<GridSortModel>([
    { field: "createDate", sort: "asc" },
  ]);

  const { data } = useGetCustomersQuery({
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
    sort:
      sortModel.at(0)?.sort === "asc"
        ? GetOrdersOrderSortEnum.Asc
        : GetOrdersOrderSortEnum.Desc,
  });

  return (
    <Stack spacing={2} py={3}>
      <DataGrid
        rows={
          data?.data?.map((customer) => {
            return {
              id: customer.id,
              createDate: new Date(
                customer.createDate ?? new Date()
              ).toLocaleDateString(),
              firstName: customer.user?.firstName,
              lastName: customer.user?.lastName,
              email: customer.user?.email,
              phoneNumber: customer.user?.phoneNumber,
            };
          }) ?? []
        }
        columns={[
          {
            field: "createDate",
            headerName: common("customerSince"),
            flex: 1,
            sortable: false,
            filterable: false,
          },
          {
            field: "firstName",
            headerName: common("firstName"),
            flex: 1,
            sortable: false,
            filterable: false,
          },
          {
            field: "lastName",
            headerName: common("lastName"),
            flex: 1,
            sortable: false,
            filterable: false,
          },
          {
            field: "email",
            headerName: common("email"),
            flex: 1,
            sortable: false,
            filterable: false,
          },
          {
            field: "phoneNumber",
            headerName: common("phoneNumber"),
            flex: 1,
            sortable: false,
            filterable: false,
          },
        ]}
        isRowSelectable={() => false}
        paginationMode="server"
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
