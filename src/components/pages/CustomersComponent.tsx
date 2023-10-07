"use client";

import { CustomersDataGrid } from "@/components/data-grids/CustomersDataGrid";
import { useRedirectNotSetupSessions } from "@/routing/useRedirectNotSetupSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Container } from "@mui/material";

export function CustomersComponent() {
  useRedirectNotSetupSessions();
  const maxHeightCssString = useMaxHeightCssString();
  return (
    <Container sx={{ py: 3, height: maxHeightCssString }} maxWidth={false}>
      <CustomersDataGrid autoPageSize={true} />
    </Container>
  );
}
