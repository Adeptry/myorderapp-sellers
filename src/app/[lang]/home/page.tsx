"use client";

import { routes } from "@/app/routes";
import { logger } from "@/utils/logger";
import { useCurrentMerchantQuery } from "@/utils/useCurrentMerchantQuery";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ConfigsApiFp } from "moa-merchants-ts-axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";

export default function Page() {
  const { push } = useRouter();
  const { status } = useSession();
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  useEffect(() => {
    if (status === "unauthenticated") {
      push(routes.login);
    }
  }, [status]);
  const getCurrentMerchantQueryState = useCurrentMerchantQuery();
  const getMyConfigQueryState = useQuery({
    queryKey: ["myConfig"],
    queryFn: async () => {
      return (
        await (
          await ConfigsApiFp(sessionedApiConfiguration).getMyConfig(
            undefined,
            "merchant"
          )
        )()
      ).data;
    },
    enabled: status === "authenticated",
    retry: false,
  });

  logger.info(status, "status");
  logger.info(getCurrentMerchantQueryState, "getCurrentMerchantQueryState");
  logger.info(getMyConfigQueryState, "getMyConfigQueryState");

  if (status === "authenticated") {
    if (getMyConfigQueryState.error) {
      push(routes.setup.theme);
    }

    if (!getCurrentMerchantQueryState.data?.squareId) {
      push(routes.setup.square.index);
    }

    // if (!getCurrentMerchantQueryState.data?.stripeCheckoutSessionId) {
    //   push(routes.setup.tier);
    // }
  } else if (status === "unauthenticated") {
    push(routes.login);
  }

  return (
    <Stack spacing={2}>
      <Typography>Hello, dashboard2.</Typography>
    </Stack>
  );
}
