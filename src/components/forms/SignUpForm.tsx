"use client";

import { routes } from "@/app/routes";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunction } from "@/components/networking/useNetworkingFunction";
import { yupResolver } from "@hookform/resolvers/yup";
import { Check, Email } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid";
import { default as MuiLink } from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import {
  AuthEmailLoginDto,
  AuthRegisterLoginDto,
  Merchant,
} from "moa-merchants-ts-axios";
import { default as NextLink } from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import AuthServices from "../layouts/AuthServices";

export function SignUpForm(props: {
  onSuccess: (merchant: Merchant) => void;
  preloading?: boolean;
}) {
  const { preloading, onSuccess } = props;
  const { auth, merchants, setSession } = useNetworkingContext();
  const [
    {
      data: createUserData,
      loading: createUserLoading,
      error: createUserError,
    },
    createUser,
  ] = useNetworkingFunction(auth.createUser.bind(auth));
  const [
    {
      data: createMerchantData,
      loading: createMerchantLoading,
      error: createMerchantError,
    },
    createMerchant,
  ] = useNetworkingFunction(merchants.createMerchant.bind(merchants));
  const [errorString, setErrorString] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AuthRegisterLoginDto>({
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

  async function handleOnValidSubmit(
    authRegisterLoginDto: AuthRegisterLoginDto
  ) {
    try {
      const registerResponse = await createUser({
        authRegisterLoginDto,
      });
      const data = registerResponse?.data;
      if (!data) {
        throw new Error("No access token");
      }
      setSession(data);
      const merchantResponse = await createMerchant({
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      if (merchantResponse?.data !== undefined) {
        onSuccess(merchantResponse.data);
      } else {
        throw new Error("No merchant response");
      }
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
      }
    }
  }

  const error = createUserError || createMerchantError;
  const loading = createUserLoading || createMerchantLoading;
  const datas = !!(createUserData || createMerchantData);

  return (
    <Box
      sx={{ width: "100%" }}
      component="form"
      noValidate
      onSubmit={handleSubmit(handleOnValidSubmit)}
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
            control={control}
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
                  error={errors.firstName ? true : false}
                  autoFocus
                />
              );
            }}
          />
          <Typography variant="inherit" color="error">
            {errors.firstName?.message}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="lastName"
            control={control}
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
                  error={errors.lastName ? true : false}
                />
              );
            }}
          />
          <Typography variant="inherit" color="error">
            {errors.lastName?.message}
          </Typography>
        </Grid>
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
                  fullWidth
                  error={errors.email ? true : false}
                />
              );
            }}
          />
          <Typography variant="inherit" color="error">
            {errors.email?.message}
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
                  fullWidth
                  error={errors.password ? true : false}
                />
              );
            }}
          />
          <Typography variant="inherit" color="error">
            {errors.password?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {preloading ? (
            <Skeleton height="56px" width="100%" />
          ) : (
            <LoadingButton
              loading={loading}
              disabled={datas}
              size="large"
              type="submit"
              fullWidth
              variant="contained"
              startIcon={datas ? <Check /> : <Email />}
            >
              Sign Up with Email
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
                <MuiLink href={routes.forgot} component={NextLink}>
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
                <MuiLink href={routes.signin} component={NextLink}>
                  Have an account? Sign in
                </MuiLink>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <AuthServices preloading={preloading} />
        </Grid>
      </Grid>
    </Box>
  );
}
