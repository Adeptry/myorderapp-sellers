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

import { routes } from "@/app/routes";
import { usePostPasswordResetMutation } from "@/networking/mutations/usePostPasswordResetMutation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Password } from "@mui/icons-material";
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
import { AuthenticationPasswordResetRequestBody } from "myorderapp-square";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { ForgotPasswordLink } from "../links/ForgotPasswordLink";
import { SignInLink } from "../links/SignInLink";

export function PasswordResetForm(props: { preloading: boolean }) {
  type FormType = AuthenticationPasswordResetRequestBody;
  const { preloading: skeleton } = props;
  const router = useRouter();

  const searchParams = useSearchParams();
  const hash = searchParams.get("hash");
  const [errorString, setErrorString] = useState<string | null>(null);
  const t = useTranslations("PasswordResetForm");

  const { setError, handleSubmit, formState, control, setValue, watch } =
    useForm<FormType & { confirmPassword: string }>({
      defaultValues: {
        password: "",
        hash: hash ?? "",
      },
      resolver: yupResolver(
        yup
          .object<FormType & { confirmPassword: string }>()
          .shape({
            hash: yup.string().required(),
            password: yup.string().min(6).label(t("newPassword")).required(),
            confirmPassword: yup
              .string()
              .label(t("confirmPassword"))
              .oneOf([yup.ref("password")], t("passwordsMustMatch"))
              .required(),
          })
          .required()
      ),
    });

  const passwordResetMutation = usePostPasswordResetMutation();

  async function handleOnValidSubmit(
    authenticationPasswordResetRequestBody: FormType
  ) {
    try {
      await passwordResetMutation.mutateAsync({
        authenticationPasswordResetRequestBody,
      });
      setTimeout(() => {
        router.push(routes.login);
      }, 3000);
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

  useEffect(() => {
    if (hash != undefined) {
      setValue("hash", hash);
    }
  }, [hash]);

  useEffect(() => {
    const subscription = watch(() => setErrorString(null));
    return () => subscription.unsubscribe();
  }, [watch()]);

  const fieldsDisabled =
    passwordResetMutation.data !== undefined || passwordResetMutation.isPending;

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit(handleOnValidSubmit)}
      sx={{ width: "100%" }}
    >
      <Grid container spacing={2}>
        {errorString && (
          <Grid item xs={12}>
            <Alert severity="error" style={{ width: "100%" }}>
              {errorString}
            </Alert>
          </Grid>
        )}
        {passwordResetMutation.data !== undefined && (
          <Grid item xs={12}>
            <Alert severity="success">{t("resetPasswordSuccess")}</Alert>
          </Grid>
        )}
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
                  label={t("newPassword")}
                  type="password"
                  disabled={fieldsDisabled}
                  inputProps={{
                    autoCapitalize: "none",
                    autoCorrect: "none",
                    spellCheck: false,
                  }}
                  fullWidth
                  autoComplete="new-password"
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
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => {
              return skeleton ? (
                <Skeleton height="56px" />
              ) : (
                <TextField
                  {...field}
                  required
                  label={t("confirmPassword")}
                  type="password"
                  disabled={fieldsDisabled}
                  inputProps={{
                    autoCapitalize: "none",
                    autoCorrect: "none",
                    spellCheck: false,
                  }}
                  fullWidth
                  autoComplete="new-password"
                  error={formState.errors.confirmPassword ? true : false}
                />
              );
            }}
          />
          <Typography variant="inherit" color="error">
            {formState.errors.confirmPassword?.message}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          {skeleton ? (
            <Skeleton height="56px" width="100%" />
          ) : (
            <LoadingButton
              loading={passwordResetMutation.isPending}
              disabled={passwordResetMutation.data !== undefined}
              type="submit"
              size="large"
              fullWidth
              startIcon={<Password />}
              variant="contained"
              color="secondary"
            >
              {t("resetPassword")}
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
