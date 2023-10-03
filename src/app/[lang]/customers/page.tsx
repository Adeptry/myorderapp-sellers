"use client";

import { CustomersDataGrid } from "@/components/data-grids/CustomersDataGrid";
import { useRedirectSetupSessions } from "@/routing/useRedirectSetupSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Container } from "@mui/material";

export default function Page() {
  useRedirectSetupSessions();
  const maxHeightCssString = useMaxHeightCssString();

  return (
    <Container sx={{ py: 3, height: maxHeightCssString }} maxWidth={false}>
      <CustomersDataGrid autoPageSize={true} />
    </Container>
  );
}
