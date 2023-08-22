"use client";

import { routes } from "@/app/routes";
import { AppConfigForm } from "@/components/forms/AppConfigForm";
import { useNetworkingContext } from "@/contexts/networking/useNetworkingContext";
import { useNetworkingFunctionP } from "@/contexts/networking/useNetworkingFunctionP";
import { Stack } from "@mui/material";
import axios from "axios";
import { AppConfigUpdateDto } from "moa-merchants-ts-axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { push } = useRouter();
  const { configs } = useNetworkingContext();
  const [getConfigState, getConfigFn] = useNetworkingFunctionP(
    configs.getConfig.bind(configs),
    true
  );

  useEffect(() => {
    async function fetch() {
      try {
        await getConfigFn({ actingAs: "merchant" }, {});
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status == 401) {
          push(routes.signin);
          return;
        }
      }
    }

    fetch();
  }, []);

  return (
    <Stack spacing={2}>
      <AppConfigForm
        key="app-config-form"
        preloading={getConfigState.loading}
        submitText={"Update your app"}
        onSuccess={() => {}}
        defaultValues={getConfigState.data as AppConfigUpdateDto}
      />
    </Stack>
  );
}
