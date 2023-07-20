"use client";

import { routes } from "@/app/routes";
import { useNetworkingContext } from "@/components/NetworkingProvider";
import useNetworkState from "@/utils/useNetworkState";
import { yupResolver } from "@hookform/resolvers/yup";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { LoadingButton } from "@mui/lab";
import { Alert } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { default as MuiLink } from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { AuthForgotPasswordDto } from "moa-merchants-ts-axios";
import { default as NextLink } from "next/link";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

export default function Page() {
  const networkingContext = useNetworkingContext();

  const [{ data, loading, error }, setRequestState] = useNetworkState<void>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthForgotPasswordDto>({
    resolver: yupResolver(
      yup
        .object<AuthForgotPasswordDto>()
        .shape({
          email: yup.string().label("Email").required(),
        })
        .required()
    ),
  });

  async function handleOnValidSubmit(
    authForgotPasswordDto: AuthForgotPasswordDto
  ) {
    try {
      setRequestState({
        data: undefined,
        loading: true,
        error: undefined,
      });
      const response = await networkingContext?.auth.forgotPassword({
        authForgotPasswordDto,
      });
      setRequestState({
        data: response?.data,
        loading: false,
        error: undefined,
      });
    } catch (error) {
      setRequestState({
        data: undefined,
        loading: false,
        error: axios.isAxiosError(error) ? error : undefined,
      });
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        {error && (
          <Alert severity="error">{JSON.stringify(error.response?.data)}</Alert>
        )}
        {data !== undefined && (
          <Alert severity="success">Check your email!</Alert>
        )}
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(handleOnValidSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="Email"
                    fullWidth
                    autoFocus
                    error={errors.email ? true : false}
                  />
                )}
              />
              <Typography variant="inherit" color="error">
                {errors.email?.message}
              </Typography>
            </Grid>
          </Grid>
          <LoadingButton
            loading={loading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Reset Password
          </LoadingButton>
          <Grid container justifyContent="flex-end">
            <Grid item xs>
              <MuiLink
                href={routes.signin}
                component={NextLink}
                variant="body2"
              >
                Back to sign in
              </MuiLink>
            </Grid>
            <Grid item>
              <MuiLink
                href={routes.signup}
                component={NextLink}
                variant="body2"
              >
                New here? Sign up
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
