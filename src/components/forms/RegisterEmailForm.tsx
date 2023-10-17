"use client";

import { ForgotPasswordLink } from "@/components/links/ForgotPasswordLink";
import { SignInLink } from "@/components/links/SignInLink";
import { moaEnv } from "@/moaEnv";
import { gtagEvent } from "@/utils/gtag-event";
import { yupResolver } from "@hookform/resolvers/yup";
import { Check, Login } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Grid,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  AuthenticationApi,
  AuthenticationEmailLoginRequestBody,
  Configuration,
  MerchantsApi,
} from "myorderapp-square";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslations } from "use-intl";
import * as yup from "yup";

export function RegisterEmailForm(props: {
  callbackUrl: string;
  skeleton?: boolean;
}) {
  type FormType = AuthenticationEmailLoginRequestBody;
  const { skeleton, callbackUrl } = props;
  const [errorString, setErrorString] = useState<string | null>(null);
  const t = useTranslations("RegisterEmailForm");

  const { formState, setError, handleSubmit, control, getValues, watch } =
    useForm<{
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }>({
      defaultValues: {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
      },
      resolver: yupResolver(
        yup
          .object<FormType>()
          .shape({
            email: yup.string().email().label(t("email")).required(),
            password: yup.string().min(6).label(t("password")).required(),
            firstName: yup.string().label(t("firstName")).required(),
            lastName: yup.string().label(t("lastName")).required(),
          })
          .required()
      ),
    });

  useEffect(() => {
    const subscription = watch(() => setErrorString(null));
    return () => subscription.unsubscribe();
  }, [watch()]);

  const createUserAndMerchantMutation = useMutation({
    mutationFn: async (authenticationEmailRegisterRequestBody: FormType) => {
      try {
        const configuration = new Configuration({
          apiKey: moaEnv.backendApiKey,
          basePath: moaEnv.backendUrl,
        });
        const createUserResponse = await new AuthenticationApi(
          configuration
        ).postEmailRegister({ authenticationEmailRegisterRequestBody });

        configuration.accessToken = createUserResponse.data.token;
        try {
          await new MerchantsApi(configuration).postMerchantMe();
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if ((error?.response?.status as number) !== 409) {
              throw error;
            }
          }
        }

        return true;
      } catch (error) {
        throw error;
      }
    },
  });

  async function handleOnValidSubmit(data: FormType) {
    try {
      await createUserAndMerchantMutation.mutateAsync(getValues());
      const response = await signIn("credentials", {
        ...data,
        callbackUrl,
      });
      if (response?.error) {
        setErrorString(response?.error);
      } else {
        gtagEvent("sign_up", { method: "email" });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const fields = (error?.response?.data as any)?.fields;
        if (fields !== undefined) {
          Object.keys(fields).forEach((fieldName) => {
            setError(fieldName as keyof FormType, {
              type: "server",
              message: fields[fieldName],
            });
          });
        }

        const message = (error?.response?.data as any)?.message;
        if (message !== undefined) {
          setErrorString(message);
        }
      } else {
        setErrorString(JSON.stringify(error));
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
                  label={t("firstName")}
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
                  label={t("lastName")}
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
                  label={t("email")}
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
                  label={t("password")}
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
                createUserAndMerchantMutation.isPending ||
                formState.isSubmitting
              }
              size="large"
              startIcon={
                createUserAndMerchantMutation.data ? <Check /> : <Login />
              }
              disabled={createUserAndMerchantMutation.isPending}
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
      </Grid>
    </Box>
  );
}
