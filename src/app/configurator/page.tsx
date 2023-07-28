"use client";

import { routes } from "@/app/routes";
import DevicePreview from "@/components/DevicePreview";
import { AppConfigForm } from "@/components/forms/AppConfigForm";
import { TabLayout } from "@/components/layouts/TabLayout";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunction } from "@/components/networking/useNetworkingFunction";
import { Skeleton, Stack } from "@mui/material";
import axios from "axios";
import { AppConfigUpdateDto } from "moa-merchants-ts-axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Page() {
  const { push } = useRouter();
  const { configs } = useNetworkingContext();
  const [{ data, loading }, getConfig] = useNetworkingFunction(
    configs.getConfig.bind(configs),
    true
  );
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        await getConfig({ actingAs: "merchant" });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status == 401) {
          push(routes.signin);
          return;
        }
      }
    }

    fetch();
  }, []);

  const preloading = true;

  return (
    <Stack spacing={3} py={3}>
      <TabLayout tabLabels={["Options", "Preview"]}>
        <AppConfigForm
          key="app-config-form"
          onChange={(field, value) => {
            iframeRef.current?.contentWindow?.postMessage(
              { [field]: value },
              "*"
            );
          }}
          preloading={preloading}
          submitText={"Update your app"}
          onSuccess={() => {
            push(routes.onboarding.square);
          }}
          shouldAutoFocus={data == null}
          defaultValues={data as AppConfigUpdateDto}
        />
        {preloading ? (
          <Skeleton height="512px" width="100%" key="device-preview-skeleton" />
        ) : (
          <DevicePreview iframeRef={iframeRef} key="device-preview" />
        )}
      </TabLayout>
    </Stack>
  );
}
