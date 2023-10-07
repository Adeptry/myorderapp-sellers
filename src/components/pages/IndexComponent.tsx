"use client";

import { useRedirectAuthenticatedSessions } from "@/routing/useRedirectAuthenticatedSessions";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Box, CircularProgress } from "@mui/material";

export function IndexComponent() {
  useRedirectUnauthenticatedSessions();
  useRedirectAuthenticatedSessions();

  const maxHeightCssString = useMaxHeightCssString();

  return (
    <Box
      height={maxHeightCssString}
      display={"flex"}
      sx={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
