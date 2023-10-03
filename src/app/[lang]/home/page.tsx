"use client";

import { Dashboard } from "@/components/DashboardComponent";
import { useRedirectSetupSessions } from "@/routing/useRedirectSetupSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Container } from "@mui/material";

export default function Page() {
  useRedirectSetupSessions();

  const maxHeightCssString = useMaxHeightCssString();
  return (
    <Container sx={{ minHeight: maxHeightCssString, py: 2 }} maxWidth={false}>
      <Dashboard />
    </Container>
  );
}
