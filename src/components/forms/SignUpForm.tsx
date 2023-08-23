"use client";

import { routes } from "@/app/routes";
import { yupResolver } from "@hookform/resolvers/yup";
import { Check, Login } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid";
import { default as MuiLink } from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  AuthApiFp,
  AuthEmailLoginDto,
  AuthRegisterLoginDto,
  Configuration,
  MerchantsApiFp,
} from "moa-merchants-ts-axios";
import { signIn } from "next-auth/react";
import { default as NextLink } from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import AuthServicesButtons from "../buttons/AuthServices";

export function SignUpForm(props: { preloading?: boolean }) {
  const { preloading } = props;
  const [errorString, setErrorString] = useState<string | null>(null);

  const form = useForm<AuthRegisterLoginDto>({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
    resolver: yupResolver(
      yup
        .object<AuthRegisterLoginDto>()
        .shape({
          email: yup.string().email().label("Email").required(),
          password: yup.string().min(6).label("Password").required(),
          firstName: yup.string().label("First name").required(),
          lastName: yup.string().label("Last name").required(),
        })
        .required()
    ),
  });

  const createUserAndMerchantMutation = useMutation(
    async (requestParameters: AuthRegisterLoginDto) => {
      try {
        const configuration = new Configuration({
          apiKey: process.env.NEXT_PUBLIC_BACKEND_API_KEY,
          basePath: process.env.NEXT_PUBLIC_BACKEND_DOMAIN,
        });
        const createUserResponse = await (
          await AuthApiFp(configuration).createUser(requestParameters)
        )();

        configuration.accessToken = createUserResponse.data.token;

        const merchantResponse = await (
          await MerchantsApiFp(configuration).createMerchant()
        )();

        return merchantResponse;
      } catch (error) {
        throw error;
      }
    }
  );

  async function handleOnValidSubmit(data: AuthRegisterLoginDto) {
    try {
      await createUserAndMerchantMutation.mutateAsync(form.getValues());
      await signIn("credentials", {
        ...data,
        callbackUrl: routes.onboarding.configurator,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.status === 422) {
        const message = (error?.response?.data as any).message;
        if (typeof message === "string") {
          setErrorString(message);
        } else {
          Object.keys(message).forEach((fieldName) => {
            form.setError(fieldName as keyof AuthEmailLoginDto, {
              type: "server",
              message: message[fieldName],
            });
          });
        }
      }
    }
  }

  return (
    <Box
      sx={{ width: "100%" }}
      component="form"
      noValidate
      onSubmit={form.handleSubmit(handleOnValidSubmit)}
    >
      <Grid
        container
        columnSpacing={preloading ? 1 : 2}
        rowSpacing={preloading ? 0 : 2}
      >
        {errorString && (
          <Grid item xs={12}>
            <Alert severity="error" style={{ width: "100%" }}>
              {errorString}
            </Alert>
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <Controller
            name="firstName"
            control={form.control}
            render={({ field }) => {
              return preloading ? (
                <Skeleton height="56px" />
              ) : (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label="First Name"
                  autoComplete="given-name"
                  inputProps={{
                    autoCorrect: "none",
                    spellCheck: false,
                  }}
                  error={form.formState.errors.firstName ? true : false}
                  autoFocus
                />
              );
            }}
          />
          <Typography variant="inherit" color="error">
            {form.formState.errors.firstName?.message}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="lastName"
            control={form.control}
            render={({ field }) => {
              return preloading ? (
                <Skeleton height="56px" />
              ) : (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label="Last Name"
                  autoComplete="family-name"
                  inputProps={{
                    autoCorrect: "none",
                    spellCheck: false,
                  }}
                  error={form.formState.errors.lastName ? true : false}
                />
              );
            }}
          />
          <Typography variant="inherit" color="error">
            {form.formState.errors.lastName?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="email"
            control={form.control}
            render={({ field }) => {
              return preloading ? (
                <Skeleton height="56px" />
              ) : (
                <TextField
                  {...field}
                  required
                  label="Email"
                  autoComplete="email"
                  inputProps={{
                    autoCapitalize: "none",
                    autoCorrect: "none",
                    spellCheck: false,
                  }}
                  fullWidth
                  error={form.formState.errors.email ? true : false}
                />
              );
            }}
          />
          <Typography variant="inherit" color="error">
            {form.formState.errors.email?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="password"
            control={form.control}
            render={({ field }) => {
              return preloading ? (
                <Skeleton height="56px" />
              ) : (
                <TextField
                  {...field}
                  required
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  inputProps={{
                    autoCapitalize: "none",
                    autoCorrect: "none",
                    spellCheck: false,
                  }}
                  fullWidth
                  error={form.formState.errors.password ? true : false}
                />
              );
            }}
          />
          <Typography variant="inherit" color="error">
            {form.formState.errors.password?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {preloading ? (
            <Skeleton height="56px" width="100%" />
          ) : (
            <LoadingButton
              loading={
                createUserAndMerchantMutation.isLoading ||
                form.formState.isSubmitting
              }
              size="large"
              startIcon={
                createUserAndMerchantMutation.data ? <Check /> : <Login />
              }
              color={
                createUserAndMerchantMutation.data ? "success" : "secondary"
              }
              type="submit"
              fullWidth
              variant="contained"
            >
              {createUserAndMerchantMutation.data
                ? "Let's go!"
                : "Sign Up with Email"}
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
              {preloading ? (
                <Skeleton component={"a"} width={"100%"} />
              ) : (
                <MuiLink
                  href={routes.forgot}
                  component={NextLink}
                  variant="body2"
                  color="secondary"
                >
                  Forgot password?
                </MuiLink>
              )}
            </Grid>
            <Grid
              item
              xs={6}
              display="flex"
              justifyContent="end"
              alignItems="center"
            >
              {preloading ? (
                <Skeleton component={"a"} width={"100%"} />
              ) : (
                <MuiLink
                  href={routes.signin}
                  component={NextLink}
                  variant="body2"
                  color="secondary"
                >
                  Have an account? Sign in
                </MuiLink>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <AuthServicesButtons preloading={preloading} />
        </Grid>
      </Grid>
    </Box>
  );
}
