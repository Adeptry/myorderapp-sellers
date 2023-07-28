"use client";

import { routes } from "@/app/routes";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunction } from "@/components/networking/useNetworkingFunction";
import { yupResolver } from "@hookform/resolvers/yup";
import { Check } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid";
import { default as MuiLink } from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { AuthEmailLoginDto } from "moa-merchants-ts-axios";
import { default as NextLink } from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import AuthServicesButtons from "../buttons/AuthServices";

export function SignInForm(props: {
  onSuccess: () => void;
  preloading?: boolean;
}) {
  const { onSuccess, preloading } = props;
  const { auth, setSession } = useNetworkingContext();
  const [{ data, loading, error }, invoke] = useNetworkingFunction(
    auth.createSession.bind(auth)
  );
  const [errorString, setErrorString] = useState<string | null>(null);

  const { control, handleSubmit, setError, formState } =
    useForm<AuthEmailLoginDto>({
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

  async function handleOnValidSubmit(authEmailLoginDto: AuthEmailLoginDto) {
    try {
      const response = await invoke({ authEmailLoginDto });
      const data = response?.data;
      if (!data) {
        throw new Error("No access token");
      }
      setSession(data);
      onSuccess();
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.status === 422) {
        const message = error?.response?.data.message;
        if (typeof message === "string") {
          setErrorString(message);
        } else {
          Object.keys(message).forEach((fieldName) => {
            setError(fieldName as keyof AuthEmailLoginDto, {
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
      onSubmit={handleSubmit(handleOnValidSubmit)}
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
            control={control}
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
          {preloading ? (
            <Skeleton height="56px" />
          ) : (
            <LoadingButton
              loading={loading || formState.isSubmitting}
              size="large"
              startIcon={formState.isSubmitSuccessful ? <Check /> : null}
              color={formState.isSubmitSuccessful ? "success" : "secondary"}
              type="submit"
              fullWidth
              variant="contained"
            >
              {formState.isSubmitSuccessful ? "" : "Sign In with email"}
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
