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
  LoginResponseType,
} from "moa-merchants-ts-axios";
import { default as NextLink } from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import AuthServicesButtons from "../buttons/AuthServices";

export function SignInForm(props: {
  onSuccess: (data: LoginResponseType) => void;
  preloading?: boolean;
}) {
  const { onSuccess, preloading } = props;

  const [errorString, setErrorString] = useState<string | null>(null);

  const form = useForm<AuthEmailLoginDto>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(
      yup
        .object<AuthEmailLoginDto>()
        .shape({
          email: yup.string().email().label("Email").required(),
          password: yup.string().min(6).label("Password").required(),
        })
        .required()
    ),
  });

  const createSessionMutation = useMutation({
    mutationFn: async (authEmailLoginDto: AuthEmailLoginDto) => {
      return (await AuthApiFp().createSession(authEmailLoginDto))();
    },
  });

  async function handleOnValidSubmit(data: AuthEmailLoginDto) {
    try {
      const response = await createSessionMutation.mutateAsync(data);

      if (!response.data) {
        throw new Error("No access token");
      }

      onSuccess(response.data);
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
      } else {
        setErrorString(JSON.stringify(error));
      }
    }
  }

  return (
    <Box
      onSubmit={form.handleSubmit(handleOnValidSubmit)}
      sx={{ width: "100%" }}
      component="form"
      noValidate
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
                  autoFocus
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
                  inputProps={{
                    autoCapitalize: "none",
                    autoCorrect: "none",
                    spellCheck: false,
                  }}
                  fullWidth
                  autoComplete="current-password"
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
            <Skeleton height="56px" />
          ) : (
            <LoadingButton
              loading={
                createSessionMutation.isLoading || form.formState.isSubmitting
              }
              size="large"
              startIcon={createSessionMutation.data ? <Check /> : <Login />}
              disabled={
                (createSessionMutation.isLoading ||
                  createSessionMutation.data) &&
                true
              }
              color="secondary"
              type="submit"
              fullWidth
              variant="contained"
            >
              {createSessionMutation.data
                ? "Welcome back!"
                : "Sign In with email"}
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
                  href={routes.signup}
                  component={NextLink}
                  variant="body2"
                  color="secondary"
                >
                  Need an account? Sign up
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
