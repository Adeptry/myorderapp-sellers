"use client";

import { Tier2SuccessCard } from "@/components/cards/Tier2SuccessCard";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Container, Stack } from "@mui/material";

export default function Page() {
  useRedirectUnauthenticatedSessions();

  const maxHeightCssString = useMaxHeightCssString();

  return (
    <Container sx={{ minHeight: maxHeightCssString }}>
      <Stack spacing={2} display="flex" alignItems="center" py={2}>
        <Tier2SuccessCard sx={{ maxWidth: "sm" }} />
      </Stack>
    </Container>
  );
}
