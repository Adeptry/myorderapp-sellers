import { routes } from "@/app/routes";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
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
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  AuthenticationApi,
  AuthenticationPasswordResetRequestBody,
} from "myorderapp-square";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { ForgotPasswordLink } from "../links/ForgotPasswordLink";
import { SignInLink } from "../links/SignInLink";

export function ResetPasswordForm(props: { preloading: boolean }) {
  type FormType = AuthenticationPasswordResetRequestBody;
  const { preloading: skeleton } = props;
  const router = useRouter();

  const searchParams = useSearchParams();
  const hash = searchParams.get("hash");
  const [errorString, setErrorString] = useState<string | null>(null);
  const common = useTranslations("Common");

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
            password: yup
              .string()
              .min(6)
              .label(common("newPassword"))
              .required(),
            confirmPassword: yup
              .string()
              .label(common("confirmPassword"))
              .oneOf([yup.ref("password")], common("passwordsMustMatch"))
              .required(),
          })
          .required()
      ),
    });

  const sessionedApiConfiguration = useSessionedApiConfiguration();
  const forgotPasswordMutation = useMutation({
    mutationFn: async (authenticationPasswordResetRequestBody: FormType) => {
      return await new AuthenticationApi(
        sessionedApiConfiguration
      ).postPasswordReset({
        authenticationPasswordResetRequestBody,
      });
    },
  });

  async function handleOnValidSubmit(data: FormType) {
    try {
      await forgotPasswordMutation.mutateAsync(data);
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
    forgotPasswordMutation.data !== undefined ||
    forgotPasswordMutation.isLoading;

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
        {forgotPasswordMutation.data !== undefined && (
          <Grid item xs={12}>
            <Alert severity="success">{common("resetPasswordSuccess")}</Alert>
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
                  label={common("newPassword")}
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
                  label={common("confirmPassword")}
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
              loading={forgotPasswordMutation.isLoading}
              disabled={forgotPasswordMutation.data !== undefined}
              type="submit"
              size="large"
              fullWidth
              startIcon={<Password />}
              variant="contained"
              color="secondary"
            >
              {common("resetPassword")}
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
