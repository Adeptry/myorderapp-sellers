"use client";

import { OrdersDataGrid } from "@/components/data-grids/OrdersDataGrid";
import { useRedirectNotSetupSessions } from "@/routing/useRedirectNotSetupSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Container } from "@mui/material";

export function OrdersComponent() {
  useRedirectNotSetupSessions();

  const maxHeightCssString = useMaxHeightCssString();

  return (
    <Container sx={{ py: 3, height: maxHeightCssString }} maxWidth={false}>
      <OrdersDataGrid autoPageSize={true} />
    </Container>
  );
}
