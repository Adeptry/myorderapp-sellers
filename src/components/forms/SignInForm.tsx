"use client";

import AppleAuthButton from "@/components/buttons/AppleAuthButton";
import GoogleAuthButton from "@/components/buttons/GoogleAuthButton";
import { ForgotPasswordLink } from "@/components/links/ForgotPasswordLink";
import { SignUpLink } from "@/components/links/SignUpLink";
import { yupResolver } from "@hookform/resolvers/yup";
import { Check, Login } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Grid, Skeleton } from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMutation } from "@tanstack/react-query";
import { AuthEmailLoginDto } from "moa-merchants-ts-axios";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

export function SignInForm(props: { callbackUrl: string; skeleton?: boolean }) {
  const { skeleton } = props;
  const [errorString, setErrorString] = useState<string | null>(null);
  const common = useTranslations("Common");
  const t = useTranslations("SignInForm");

  const { handleSubmit, control, formState } = useForm<AuthEmailLoginDto>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(
      yup
        .object<AuthEmailLoginDto>()
        .shape({
          email: yup.string().email().label(common("email")).required(),
          password: yup.string().min(6).label(common("password")).required(),
        })
        .required()
    ),
  });

  const createSessionMutation = useMutation({
    mutationFn: async (authEmailLoginDto: AuthEmailLoginDto) => {
      return await signIn("credentials", {
        ...authEmailLoginDto,
        callbackUrl: props.callbackUrl,
        redirect: false,
      });
    },
  });

  async function handleOnValidSubmit(data: AuthEmailLoginDto) {
    const result = await createSessionMutation.mutateAsync(data);
    if (result?.error) {
      setErrorString(result?.error);
    }
  }

  return (
    <Box
      onSubmit={handleSubmit(handleOnValidSubmit)}
      sx={{ width: "100%" }}
      component="form"
      noValidate
    >
      <Grid
        container
        columnSpacing={skeleton ? 1 : 2}
        rowSpacing={skeleton ? 0 : 2}
      >
        {errorString && (
          <Grid item xs={12}>
            <Alert severity="error" style={{ width: "100%" }}>
              {errorString}
            </Alert>
          </Grid>
        )}
        <Grid item xs={12}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => {
              return skeleton ? (
                <Skeleton height="56px" />
              ) : (
                <TextField
                  {...field}
                  required
                  label={common("email")}
                  autoComplete="email"
                  inputProps={{
                    autoCapitalize: "none",
                    autoCorrect: "none",
                    spellCheck: false,
                  }}
                  fullWidth
                  autoFocus
                  error={formState.errors.email ? true : false}
                />
              );
            }}
          />
          <Typography variant="inherit" color="error">
            {formState.errors.email?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => {
              return skeleton ? (
                <Skeleton height="56px" />
              ) : (
                <TextField
                  {...field}
                  required
                  label={common("password")}
                  type="password"
                  inputProps={{
                    autoCapitalize: "none",
                    autoCorrect: "none",
                    spellCheck: false,
                  }}
                  fullWidth
                  autoComplete="current-password"
                  error={formState.errors.password ? true : false}
                />
              );
            }}
          />
          <Typography variant="inherit" color="error">
            {formState.errors.password?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {skeleton ? (
            <Skeleton height="56px" />
          ) : (
            <LoadingButton
              loading={
                createSessionMutation.isLoading || formState.isSubmitting
              }
              size="large"
              startIcon={createSessionMutation.data ? <Check /> : <Login />}
              disabled={createSessionMutation.isLoading}
              color="secondary"
              type="submit"
              fullWidth
              variant="contained"
            >
              {t("submitButton")}
            </LoadingButton>
          )}
        </Grid>
        <Grid item xs={12}>
          <Grid container columnSpacing={1}>
            <Grid
              item
              xs={6}
              display="flex"
              justifyContent="start"
              alignItems="center"
            >
              {skeleton ? (
                <Skeleton component={"a"} width={"100%"} />
              ) : (
                <ForgotPasswordLink />
              )}
            </Grid>
            <Grid
              item
              xs={6}
              display="flex"
              justifyContent="end"
              alignItems="center"
              textAlign={"right"}
            >
              {skeleton ? (
                <Skeleton component={"a"} width={"100%"} />
              ) : (
                <SignUpLink />
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {skeleton ? <Skeleton height="56px" /> : <GoogleAuthButton />}
        </Grid>
        <Grid item xs={12}>
          {skeleton ? <Skeleton height="56px" /> : <AppleAuthButton />}
        </Grid>
      </Grid>
    </Box>
  );
}
