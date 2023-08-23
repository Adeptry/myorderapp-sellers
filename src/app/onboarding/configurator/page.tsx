"use client";

import { routes } from "@/app/routes";
import {
  OnboardingStepper,
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { AppConfigForm } from "@/components/forms/AppConfigForm";
import { stringToColor } from "@/utils/stringToColor";
import { useCurrentMerchantQuery } from "@/utils/useCurrentMerchantQuery";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { Skeleton, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ConfigsApiFp } from "moa-merchants-ts-axios";
import { useRouter } from "next/navigation";

export default function Page() {
  const { push } = useRouter();
  const { configuration, preloading } = useSessionedApiConfiguration();
  const { data: currentMerchantData } = useCurrentMerchantQuery();

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

  const currentMerchant = currentMerchantData?.data;
  const currentUser = currentMerchant?.user;
  const firstName = currentUser?.firstName;
  const lastName = currentUser?.lastName;
  const fullName = `${firstName ?? ""} ${lastName ?? ""}`;

  return (
    <Stack spacing={2} py={2}>
      {preloading ? (
        <Skeleton height={"24px"} />
      ) : (
        <OnboardingStepper
          activeStep={OnboardingSteps.configure}
          sx={{ width: "100%" }}
        />
      )}
      {preloading ? (
        <>
          <Skeleton variant="text" />
        </>
      ) : (
        <Typography variant="body1" textAlign={"center"}>
          Welcome to the app configurator! Personalize your app and view changes
          instantly. Unsure about colors or fonts? No worries,{" "}
          <strong>you can update those anytime</strong> and your changes will
          reflect immediately in-app, even after launch. And if you don't have
          an icon on hand, don't worry, we'll be in touch to help you create one
          totally free of charge.
        </Typography>
      )}

      {!myConfigQuery.isLoading && (
        <AppConfigForm
          key="app-config-form"
          submitText={"Create your app"}
          onSuccess={() => {
            push(routes.onboarding.square.index);
          }}
          defaultValues={{
            name: myConfigQuery.data?.name ?? "",
            seedColor:
              myConfigQuery.data?.seedColor ?? fullName
                ? stringToColor(fullName)
                : "#6750A4",
            fontFamily: myConfigQuery.data?.fontFamily ?? "Roboto",
            themeMode: myConfigQuery.data?.themeMode ?? "system",
            useMaterial3: myConfigQuery.data?.useMaterial3 ?? true,
          }}
        />
      )}
    </Stack>
  );
}
