"use client";

import { routes } from "@/app/routes";
import { SignInForm } from "@/components/forms/SignInForm";
import { useCurrentMerchantQuery } from "@/utils/useCurrentMerchantQuery";
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
      push(routes.catalog);
    }
  }, [data]);

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={6}>
        <Box display="flex" justifyContent="center">
          <Typography component="h1" variant="h4" py={3}>
            {common("signIn")}
          </Typography>
        </Box>

        <SignInForm
          callbackUrl={routes.dashboard}
          skeleton={status === "loading"}
        />
      </Grid>
    </Grid>
  );
}