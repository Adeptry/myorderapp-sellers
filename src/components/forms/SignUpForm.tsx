"use client";

import AppleAuthButton from "@/components/buttons/AppleAuthButton";
import GoogleAuthButton from "@/components/buttons/GoogleAuthButton";
import { ForgotPasswordLink } from "@/components/links/ForgotPasswordLink";
import { SignInLink } from "@/components/links/SignInLink";
import { moaEnv } from "@/utils/moaEnv";
import { yupResolver } from "@hookform/resolvers/yup";
import { Check, Login } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid";
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
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslations } from "use-intl";
import * as yup from "yup";

export function SignUpForm(props: { callbackUrl: string; skeleton?: boolean }) {
  const { skeleton, callbackUrl } = props;
  const [errorString, setErrorString] = useState<string | null>(null);
  const t = useTranslations("SignUpForm");
  const common = useTranslations("Common");

  const { formState, setError, handleSubmit, control, getValues } =
    useForm<AuthRegisterLoginDto>({
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
            email: yup.string().email().label(common("email")).required(),
            password: yup.string().min(6).label(common("password")).required(),
            firstName: yup.string().label(common("firstName")).required(),
            lastName: yup.string().label(common("lastName")).required(),
          })
          .required()
      ),
    });

  const createUserAndMerchantMutation = useMutation(
    async (requestParameters: AuthRegisterLoginDto) => {
      try {
        const configuration = new Configuration({
          apiKey: moaEnv.backendApiKey,
          basePath: moaEnv.backendUrl,
        });
        const createUserResponse = await (
          await AuthApiFp(configuration).register(requestParameters)
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
      await createUserAndMerchantMutation.mutateAsync(getValues());
      const response = await signIn("credentials", {
        ...data,
        callbackUrl,
      });
      if (response?.error) {
        setErrorString(response?.error);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.status === 422) {
        const message = (error?.response?.data as any).message;
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

  return (
    <Box
      sx={{ width: "100%" }}
      component="form"
      noValidate
      onSubmit={handleSubmit(handleOnValidSubmit)}
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
        <Grid item xs={12} sm={6}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => {
              return skeleton ? (
                <Skeleton height="56px" />
              ) : (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label={common("firstName")}
                  autoComplete="given-name"
                  inputProps={{
                    autoCorrect: "none",
                    spellCheck: false,
                  }}
                  error={formState.errors.firstName ? true : false}
                  autoFocus
                />
              );
            }}
          />
          <Typography variant="inherit" color="error">
            {formState.errors.firstName?.message}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => {
              return skeleton ? (
                <Skeleton height="56px" />
              ) : (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label={common("lastName")}
                  autoComplete="family-name"
                  inputProps={{
                    autoCorrect: "none",
                    spellCheck: false,
                  }}
                  error={formState.errors.lastName ? true : false}
                />
              );
            }}
          />
          <Typography variant="inherit" color="error">
            {formState.errors.lastName?.message}
          </Typography>
        </Grid>
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
                  autoComplete="new-password"
                  inputProps={{
                    autoCapitalize: "none",
                    autoCorrect: "none",
                    spellCheck: false,
                  }}
                  fullWidth
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
            <Skeleton height="56px" width="100%" />
          ) : (
            <LoadingButton
              loading={
                createUserAndMerchantMutation.isLoading ||
                formState.isSubmitting
              }
              size="large"
              startIcon={
                createUserAndMerchantMutation.data ? <Check /> : <Login />
              }
              disabled={createUserAndMerchantMutation.isLoading}
              color={"secondary"}
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
                <SignInLink />
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
