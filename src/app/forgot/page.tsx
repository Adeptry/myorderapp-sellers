"use client";

import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunctionNP } from "@/components/networking/useNetworkingFunctionNP";
import { Box, Grid, Skeleton } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { routes } from "../routes";

export default function Page() {
  const { push } = useRouter();
  const { merchants, session } = useNetworkingContext();
  const [{ loading }, invoke] = useNetworkingFunctionNP(
    merchants.getCurrentMerchant.bind(merchants),
    true
  );

  useEffect(() => {
    async function fetch() {
      try {
        const response = await invoke({});
        if (response.data) {
          push(routes.catalog);
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
            <Skeleton component={"h4"} width={"50px"} sx={{ py: 3 }} />
          ) : (
            <Typography component="h1" variant="h4" py={3}>
              Reset Password
            </Typography>
          )}
        </Box>
        <ForgotPasswordForm preloading={loading} />
      </Grid>
    </Grid>
  );
}
