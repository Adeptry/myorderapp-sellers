"use client";

import { routes } from "@/app/routes";
import { useCurrentMerchantQuery } from "@/utils/useCurrentMerchantQuery";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Box, CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";

export default function Page() {
  const maxHeightCssString = useMaxHeightCssString();
  const { status: authenticationStatus } = useSession();
  const { data: currentMerchantData } = useCurrentMerchantQuery();
  const router = useRouter();

  if (authenticationStatus === "unauthenticated") {
    router.push(routes.login);
  }

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
