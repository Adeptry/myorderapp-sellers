import { routes } from "@/app/routes";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunction } from "@/components/networking/useNetworkingFunction";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Grid,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { default as MuiLink } from "@mui/material/Link";
import axios from "axios";
import { AuthForgotPasswordDto } from "moa-merchants-ts-axios";
import { default as NextLink } from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

export function ForgotPasswordForm(props: { preloading: boolean }) {
  const { preloading } = props;
  const { auth } = useNetworkingContext();
  const [{ data, loading, error }, invoke] = useNetworkingFunction(
    auth.forgotPassword.bind(auth)
  );
  const [errorString, setErrorString] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AuthForgotPasswordDto>({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(
      yup
        .object<AuthForgotPasswordDto>()
        .shape({
          email: yup.string().email().label("Email").required(),
        })
        .required()
    ),
  });

  async function handleOnValidSubmit(
    authForgotPasswordDto: AuthForgotPasswordDto
  ) {
    try {
      await invoke({ authForgotPasswordDto });
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.status === 422) {
        const message = error?.response?.data.message;
        if (typeof message === "string") {
          setErrorString(message);
        } else {
          Object.keys(message).forEach((fieldName) => {
            setError(fieldName as keyof AuthForgotPasswordDto, {
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
        {data !== undefined && (
          <Grid item xs={12}>
            <Alert severity="success">Check your email!</Alert>
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
                  inputProps={{
                    autoCapitalize: "none",
                    autoCorrect: "none",
                    spellCheck: false,
                  }}
                  fullWidth
                  autoFocus
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
          {preloading ? (
            <Skeleton height="56px" width="100%" />
          ) : (
            <LoadingButton
              loading={loading}
              type="submit"
              size="large"
              fullWidth
              variant="contained"
            >
              Reset Password
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
                <MuiLink href={routes.signin} component={NextLink}>
                  Back to sign in
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
                <MuiLink href={routes.signup} component={NextLink}>
                  New here? Sign up
                </MuiLink>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
