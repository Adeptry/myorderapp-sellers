"use client";

import { routes } from "@/app/routes";
import { SignInForm } from "@/components/forms/SignInForm";
import { useCurrentMerchantQuery } from "@/queries/useCurrentMerchantQuery";
import { Box, Grid, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";

export default function Page() {
  const { push } = useRouter();
  const { status } = useSession();
  const { data } = useCurrentMerchantQuery();
  const common = useTranslations("Common");

  useEffect(() => {
    if (data) {
      push(routes.index);
    }
  }, [data]);

  return (
    <Grid container justifyContent="center" py={2}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Box display="flex" justifyContent="center">
          <Typography component="h1" variant="h4" pb={3}>
            {common("logIn")}
          </Typography>
        </Box>

        <SignInForm callbackUrl={routes.home} skeleton={status === "loading"} />
      </Grid>
    </Grid>
  );
}
