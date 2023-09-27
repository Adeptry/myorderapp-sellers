import { SignInLink } from "@/components/links/SignInLink";
import { SignUpLink } from "@/components/links/SignUpLink";
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
  AuthenticationPasswordForgotRequestBody,
} from "myorderapp-square";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

export function ForgotPasswordForm(props: { preloading: boolean }) {
  const { preloading: skeleton } = props;
  const [errorString, setErrorString] = useState<string | null>(null);
  const common = useTranslations("Common");

  const { setError, handleSubmit, formState, control, watch } =
    useForm<AuthenticationPasswordForgotRequestBody>({
      defaultValues: {
        email: "",
      },
      resolver: yupResolver(
        yup
          .object<AuthenticationPasswordForgotRequestBody>()
          .shape({
            email: yup.string().email().label(common("email")).required(),
          })
          .required()
      ),
    });

  const sessionedApiConfiguration = useSessionedApiConfiguration();
  const forgotPasswordMutation = useMutation({
    mutationFn: async (
      authenticationPasswordForgotRequestBody: AuthenticationPasswordForgotRequestBody
    ) => {
      return await new AuthenticationApi(
        sessionedApiConfiguration
      ).postPasswordForgot({
        authenticationPasswordForgotRequestBody,
      });
    },
  });

  async function handleOnValidSubmit(
    data: AuthenticationPasswordForgotRequestBody
  ) {
    try {
      await forgotPasswordMutation.mutateAsync(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const fields = (error?.response?.data as any)?.fields;
        const message = (error?.response?.data as any)?.message;
        if (fields !== undefined) {
          Object.keys(fields).forEach((fieldName) => {
            setError(
              fieldName as keyof AuthenticationPasswordForgotRequestBody,
              {
                type: "server",
                message: fields[fieldName],
              }
            );
          });
        } else if (message !== undefined) {
          setErrorString(message);
        }
      } else {
        setErrorString(JSON.stringify(error));
      }
    }
  }

  useEffect(() => {
    const subscription = watch(() => setErrorString(null));
    return () => subscription.unsubscribe();
  }, [watch()]);

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
            <Alert severity="success">{common("forgotPasswordSuccess")}</Alert>
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
          {skeleton ? (
            <Skeleton height="56px" width="100%" />
          ) : (
            <LoadingButton
              loading={forgotPasswordMutation.isLoading}
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
                <SignInLink />
              )}
            </Grid>
            <Grid
              item
              xs={6}
              display="flex"
              justifyContent="end"
              alignItems="center"
            >
              {skeleton ? (
                <Skeleton component={"a"} width={"100%"} />
              ) : (
                <SignUpLink />
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
