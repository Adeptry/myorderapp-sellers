import { ForgotPasswordLink } from "@/components/links/ForgotPasswordLink";
import { SignUpLink } from "@/components/links/SignUpLink";
import { gtagEvent } from "@/utils/gtag-event";
import { yupResolver } from "@hookform/resolvers/yup";
import { Check, Login } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Grid, Skeleton } from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { AuthenticationEmailLoginRequestBody } from "myorderapp-square";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

export function LoginEmailForm(props: {
  callbackUrl: string;
  skeleton?: boolean;
}) {
  type FormType = AuthenticationEmailLoginRequestBody;
  const { skeleton } = props;
  const [errorString, setErrorString] = useState<string | null>(null);
  const t = useTranslations("LoginEmailForm");

  const { handleSubmit, control, formState, setError, watch } =
    useForm<FormType>({
      defaultValues: {
        email: "",
        password: "",
      },
      resolver: yupResolver(
        yup
          .object<FormType>()
          .shape({
            email: yup.string().email().label(t("emailField")).required(),
            password: yup.string().min(6).label(t("passwordField")).required(),
          })
          .required()
      ),
    });

  useEffect(() => {
    const subscription = watch(() => setErrorString(null));
    return () => subscription.unsubscribe();
  }, [watch()]);

  const createSessionMutation = useMutation({
    mutationFn: async (authEmailLoginDto: FormType) => {
      return await signIn("credentials", {
        ...authEmailLoginDto,
        callbackUrl: props.callbackUrl,
        redirect: false,
      });
    },
  });

  async function handleOnValidSubmit(data: FormType) {
    try {
      const result = await createSessionMutation.mutateAsync(data);
      if (result?.error) {
        handleError(result?.error);
      } else {
        gtagEvent("login", { method: "email" });
      }
    } catch (error) {
      handleError(error);
    }
  }

  function handleError(error: any) {
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

  return (
    <Box
      onSubmit={handleSubmit(handleOnValidSubmit)}
      sx={{ width: "100%" }}
      component="form"
      noValidate
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
                  label={t("emailField")}
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
              return skeleton ? (
                <Skeleton height="56px" />
              ) : (
                <TextField
                  {...field}
                  required
                  label={t("passwordField")}
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
          {skeleton ? (
            <Skeleton height="56px" />
          ) : (
            <LoadingButton
              loading={
                createSessionMutation.isPending || formState.isSubmitting
              }
              size="large"
              startIcon={createSessionMutation.data ? <Check /> : <Login />}
              disabled={createSessionMutation.isPending}
              color="secondary"
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
                <SignUpLink />
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
