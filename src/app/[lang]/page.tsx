"use client";

import { routes } from "@/app/routes";
import { useCurrentConfigQuery } from "@/queries/useCurrentAppConfigQuery";
import { useCurrentMerchantQuery } from "@/queries/useCurrentMerchantQuery";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Box, CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";

export default function Page() {
  const maxHeightCssString = useMaxHeightCssString();
  const { status: authenticationStatus } = useSession();
  const { data: currentMerchantData, status: currentMerchantStatus } =
    useCurrentMerchantQuery();
  useCurrentConfigQuery();
  const router = useRouter();

  useEffect(() => {
    if (authenticationStatus === "unauthenticated") {
      router.push(routes.login);
    } else if (authenticationStatus === "authenticated") {
      if (currentMerchantStatus === "success") {
        if (currentMerchantData.squareId == undefined) {
          router.push(routes.setup.square.index);
        } else if (currentMerchantData.catalogId == undefined) {
          router.push(routes.setup.catalog);
        } else if (currentMerchantData.tier == undefined) {
          router.push(routes.setup.tier);
        } else {
          router.push(routes.home);
        }
      }
    }
  }, [authenticationStatus, currentMerchantData]);

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
