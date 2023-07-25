"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunction } from "@/components/networking/useNetworkingFunction";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { routes } from "../routes";

export default function Page() {
  const { push } = useRouter();
  const { merchants } = useNetworkingContext();
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" py={3}>
          Reset Password
        </Typography>
        <ForgotPasswordForm preloading={loading} />
      </Box>
    </Container>
  );
}
