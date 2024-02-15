import { useGetCustomersQuery } from "@/networking/queries/useGetCustomersQuery";
import { Box, Typography } from "@mui/material";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";
import { DataGrid, GridActionsCellItem, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import {
  GetCustomersOrderFieldEnum,
  GetOrdersOrderSortEnum,
} from "myorderapp-square";
import { useTranslations } from "next-intl";
import { Fragment, useState } from "react";
import { DeleteCustomerDialog } from "../dialogs/DeleteCustomerDialog";
import { Delete } from "@mui/icons-material";
import { useDeleteCustomerMutation } from "@/networking/mutations/useDeleteCustomerMutation";

export function CustomersDataGrid(props: {
  autoPageSize?: boolean;
  initialPageSize?: number;
  startDate?: Date;
  endDate?: Date;
}) {
  const { autoPageSize, initialPageSize, startDate, endDate } = props;
  const theme = useTheme();
  const t = useTranslations("CustomersDataGrid");
  const isMdOrUp = useMediaQuery(theme.breakpoints.up("sm"));

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: initialPageSize ?? 25,
  });

  const [sortModel, setGridSortModel] = useState<GridSortModel>([
    { field: "createDate", sort: "desc" },
  ]);
  const [deleteCustomerId, setDeleteCustomerId] = useState<string | null>(null);
  const deleteCustomerMutation = useDeleteCustomerMutation();

  const {
    data: getCustomersQueryResponse,
    isLoading: getCustomersQueryIsLoading,
  } = useGetCustomersQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
    user: true,
    orderField:
      sortModel.length > 0
        ? (sortModel[0].field as GetCustomersOrderFieldEnum)
        : undefined,
    orderSort:
      sortModel.at(0)?.sort === "asc"
        ? GetOrdersOrderSortEnum.Asc
        : GetOrdersOrderSortEnum.Desc,
  });

  const noDataOverlay = (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Typography>{t("noData")}</Typography>
    </Box>
  );

  return (
    <Fragment>
      <DataGrid
        loading={getCustomersQueryIsLoading}
        rowCount={getCustomersQueryResponse?.count ?? 0}
        autoPageSize={autoPageSize}
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

        columnVisibilityModel={{
          id: isMdOrUp,
          location: isMdOrUp,
        }}
        rows={
          getCustomersQueryResponse?.data?.map((customer) => {
            return {
              id: customer.id,
              createDate: new Date(
                customer.createDate ?? new Date()
              ).toLocaleDateString(),
              name: customer.user?.fullName,
              email: customer.user?.email,
              phoneNumber: customer.user?.phoneNumber,
            };
          }) ?? []
        }
        columns={[
          {
            field: "createDate",
            headerName: t("createDateHeaderName"),
            flex: 1,
            sortable: true,
            filterable: false,
            minWidth: 175,
          },
          {
            field: "email",
            headerName: t("emailHeaderName"),
            flex: 1,
            sortable: false,
            filterable: false,
            minWidth: 200,
          },
          {
            field: "name",
            headerName: t("nameHeaderName"),
            flex: 1,
            sortable: false,
            filterable: false,
            minWidth: 200,
          },
          {
            field: "phoneNumber",
            headerName: t("phoneNumberHeaderName"),
            flex: 1,
            sortable: false,
            filterable: false,
            minWidth: 200,
          },
          {
            field: 'actions',
            type: 'actions',
            width: 80,
            getActions: (params) => [
              <GridActionsCellItem
                label="Delete"
                icon={<Delete />}
                showInMenu={true}
                onClick={() => setDeleteCustomerId(params.id as string)}
              />
            ],
          },
        ]}
      />
      <DeleteCustomerDialog open={deleteCustomerId != null} onClose={async (confirmed) => {
        if (confirmed && deleteCustomerId) {
          await deleteCustomerMutation.mutateAsync({ id: deleteCustomerId })
        }
        setDeleteCustomerId(null)
      }} />
    </Fragment>
  );
}
