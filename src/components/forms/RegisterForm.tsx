/*
    This code is part of the myorderapp-sellers front-end.
    Copyright (C) 2024  Adeptry, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

"use client";

import { ForgotPasswordLink } from "@/components/links/ForgotPasswordLink";
import { SignInLink } from "@/components/links/SignInLink";
import { useRegisterAndPostMerchantMeMutation } from "@/networking/mutations/useRegisterAndPostMerchantMeMutation";
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
import axios from "axios";
import { AuthenticationEmailLoginRequestBody } from "myorderapp-square";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslations } from "use-intl";
import * as yup from "yup";
import { AppleAuthButton } from "../buttons/AppleAuthButton";
import { GoogleAuthButton } from "../buttons/GoogleAuthButton";

export function RegisterForm(props: {
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

  const registerAndPostMerchantMeMutation =
    useRegisterAndPostMerchantMeMutation();

  async function handleOnValidSubmit(data: FormType) {
    try {
      await registerAndPostMerchantMeMutation.mutateAsync({
        authenticationEmailRegisterRequestBody: getValues(),
      });
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
                registerAndPostMerchantMeMutation.isPending ||
                formState.isSubmitting
              }
              size="large"
              startIcon={
                registerAndPostMerchantMeMutation.data ? <Check /> : <Login />
              }
              disabled={registerAndPostMerchantMeMutation.isPending}
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
          <Grid container rowGap={skeleton ? 0 : 2}>
            <Grid item xs={12}>
              {skeleton ? <Skeleton height="56px" /> : <GoogleAuthButton />}
            </Grid>
            <Grid item xs={12}>
              {skeleton ? <Skeleton height="56px" /> : <AppleAuthButton />}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
