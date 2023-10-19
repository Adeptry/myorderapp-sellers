"use client";

import { routes } from "@/app/routes";
import { useRedirectNotSetupSessions } from "@/routing/useRedirectNotSetupSessions";
import { useRedirectSetupSessions } from "@/routing/useRedirectSetupSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Box, CircularProgress } from "@mui/material";

export function SetupComponent() {
  useRedirectNotSetupSessions();
  useRedirectSetupSessions(routes.dashboard);

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
