"use client";

import { routes } from "@/app/routes";
import { Configurator } from "@/components/Configurator";
import OnboardingStepper, {
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunction } from "@/components/networking/useNetworkingFunction";
import { Skeleton, Stack, useMediaQuery, useTheme } from "@mui/material";
import axios from "axios";
import { AppConfigUpdateDto } from "moa-merchants-ts-axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { push } = useRouter();
  const { configs, session } = useNetworkingContext();
  const [{ data, loading, error }, invoke] = useNetworkingFunction(
    configs.getConfig.bind(configs),
    true
  );
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    async function fetch() {
      try {
        await invoke({ actingAs: "merchant" });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status == 401) {
          push("/signin");
          return;
        }
      }
    }

    fetch();
  }, []);

  return (
    <Stack spacing={3} py={3}>
      {loading ? (
        <Skeleton height={"24px"} />
      ) : (
        <OnboardingStepper activeStep={OnboardingSteps.configure} />
      )}
      <Configurator
        onSuccess={() => {
          push(routes.square);
        }}
        submitText={"Create your app"}
        preloading={loading}
        shouldAutoFocus={data == null}
        defaultValues={data as AppConfigUpdateDto}
      />
    </Stack>
  );
}
