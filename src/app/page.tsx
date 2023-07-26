"use client";

import { routes } from "@/app/routes";
import { SignUpLayout } from "@/components/layouts/SignUpLayout";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunction } from "@/components/networking/useNetworkingFunction";
import { Container } from "@mui/material";
import { Merchant } from "moa-merchants-ts-axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { push } = useRouter();
  const { merchants, session } = useNetworkingContext();
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
    <Container maxWidth="xs">
      <SignUpLayout
        preloading={loading || session != null}
        onSuccess={function (merchant: Merchant): void {
          push(routes.configurator);
        }}
      />
    </Container>
  );
}
