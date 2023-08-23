"use client";

import { AppConfigForm } from "@/components/forms/AppConfigForm";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ConfigsApiFp } from "moa-merchants-ts-axios";
import { useRouter } from "next/navigation";

export default function Page() {
  const { push } = useRouter();
  const { configuration, preloading } = useSessionedApiConfiguration();
  const myConfigQuery = useQuery({
    queryKey: ["myConfigQuery"],
    queryFn: async () => {
      return (
        await (
          await ConfigsApiFp(configuration).getConfig(undefined, "merchant")
        )()
      ).data;
    },
    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    enabled: !preloading,
  });

  return (
    <Stack spacing={2} py={2}>
      {!myConfigQuery.isLoading && (
        <AppConfigForm
          key="app-config-form"
          submitText={"Create your app"}
          onSuccess={() => {}}
          defaultValues={myConfigQuery.data}
        />
      )}
    </Stack>
  );
}
