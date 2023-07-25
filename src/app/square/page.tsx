"use client";

import OnboardingStepper, {
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import SquareOauthButton from "@/components/SquareOauthButton";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunction } from "@/components/networking/useNetworkingFunction";
import { Box, Container, Skeleton } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { routes } from "../routes";

export default function Page() {
  const { push } = useRouter();
  const { merchants, setSession } = useNetworkingContext();
  const [{ data, loading, error }, invoke] = useNetworkingFunction(
    merchants.getCurrentMerchant.bind(merchants),
    true
  );

  useEffect(() => {
    async function fetch() {
      try {
        const response = await invoke({});
        if (!response.data) {
          setSession(null);
          push(routes.signin);
        }
      } catch (error) {}
    }

    fetch();
  }, []);

  const isOnboarding = data?.squareId == null;
  return (
    <>
      <Container maxWidth="md">
        {isOnboarding && (
          <OnboardingStepper activeStep={OnboardingSteps.square} />
        )}
        {loading && <Skeleton height="56px" />}
        <Box pt={3} justifyContent={"center"} display="flex">
          {data?.id && <SquareOauthButton state={data.id} />}
        </Box>
      </Container>
    </>
  );
}
