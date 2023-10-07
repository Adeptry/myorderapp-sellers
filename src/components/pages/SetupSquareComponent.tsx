"use client";

import { routes } from "@/app/routes";
import { SquareOauthExplainerCard } from "@/components/cards/SquareOauthExplainerCard";
import { OnboardingStepper } from "@/components/steppers/OnboardingStepper";
import { useGetMerchantMeQuery } from "@/networking/queries/useGetMerchantMeQuery";
import { useRedirectUnauthenticatedSessions } from "@/routing/useRedirectUnauthenticatedSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Container, Stack } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";

export function SetupSquareComponent() {
  useRedirectUnauthenticatedSessions();
  const { push } = useRouter();
  const { data } = useGetMerchantMeQuery();

  const maxHeightCssString = useMaxHeightCssString();

  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      push(routes.login);
    }
  }, [status]);

  useEffect(() => {
    if (data?.squareId) {
      push(routes.setup.catalog);
    }
  }, [data]);

  return (
    <Container sx={{ minHeight: maxHeightCssString }}>
      <Stack spacing={2} alignItems={"center"} py={2}>
        <OnboardingStepper step="square" sx={{ width: "100%" }} />

        <SquareOauthExplainerCard
          sx={{
            maxWidth: "sm",
          }}
        />
      </Stack>
    </Container>
  );
}
