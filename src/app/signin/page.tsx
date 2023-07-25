"use client";

import { routes } from "@/app/routes";
import { SignInLayout } from "@/components/layouts/SignInLayout";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunction } from "@/components/networking/useNetworkingFunction";
import Container from "@mui/material/Container";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useIsClient } from "usehooks-ts";

export default function Page() {
  const { session, merchants } = useNetworkingContext();
  const isClient = useIsClient();
  const { push } = useRouter();
  const [{ loading }, invoke] = useNetworkingFunction(
    merchants.getCurrentMerchant.bind(merchants),
    true
  );

  useEffect(() => {
    async function fetch() {
      try {
        const response = await invoke({});
        if (response.data) {
          push(routes.home);
        }
      } catch (error) {}
    }

    fetch();
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <SignInLayout
        preloading={loading}
        onSuccess={() => {
          push(routes.configurator);
        }}
      />
    </Container>
  );
}
