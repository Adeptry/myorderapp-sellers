"use client";

import { routes } from "@/app/routes";
import { SignInForm } from "@/components/forms/SignInForm";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunction } from "@/components/networking/useNetworkingFunction";
import { Box, Grid, Skeleton, Typography } from "@mui/material";
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

  const preloading = loading || session != null;

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={6}>
        <Box display="flex" justifyContent="center">
          {preloading ? (
            <Skeleton component={"h5"} width={"50px"} sx={{ py: 3 }} />
          ) : (
            <Typography component="h1" variant="h5" py={3}>
              Sign in
            </Typography>
          )}
        </Box>

        <SignInForm
          onSuccess={() => push(routes.configurator)}
          preloading={preloading}
        />
      </Grid>
    </Grid>
  );
}
