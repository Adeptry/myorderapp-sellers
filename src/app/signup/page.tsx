"use client";

import { routes } from "@/app/routes";
import { useNetworkingContext } from "@/components/NetworkingProvider";
import useAccessToken from "@/utils/useAccessToken";
import useNetworkState from "@/utils/useNetworkState";
import useRefreshToken from "@/utils/useRefreshToken";
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
import {
  AuthRegisterLoginDto,
  LoginResponseType,
} from "moa-merchants-ts-axios";
import { default as NextLink } from "next/link";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

export default function Page() {
  const networkingContext = useNetworkingContext();
  const [, setAccessToken] = useAccessToken();
  const [, setRefreshToken] = useRefreshToken();
  const [{ loading, error }, setRequestState] =
    useNetworkState<LoginResponseType>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthRegisterLoginDto>({
    resolver: yupResolver(
      yup
        .object<AuthRegisterLoginDto>()
        .shape({
          email: yup.string().label("Email").required(),
          password: yup.string().label("Password").required(),
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
      setRequestState({
        data: undefined,
        loading: true,
        error: undefined,
      });
      const response = await networkingContext?.auth.register({
        authRegisterLoginDto,
      });
      setRequestState({
        data: response?.data,
        loading: false,
        error: undefined,
      });
      setAccessToken(response?.data?.token ?? null);
      setRefreshToken(response?.data?.refreshToken ?? null);
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
          Sign up
        </Typography>
        {error && (
          <Alert severity="error">{JSON.stringify(error.response?.data)}</Alert>
        )}
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(handleOnValidSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="First Name"
                    autoComplete="given-name"
                    error={errors.firstName ? true : false}
                  />
                )}
              />
              <Typography variant="inherit" color="error">
                {errors.firstName?.message}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Last Name"
                    autoComplete="family-name"
                    error={errors.lastName ? true : false}
                  />
                )}
              />
              <Typography variant="inherit" color="error">
                {errors.lastName?.message}
              </Typography>
            </Grid>
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
            <Grid item xs={12}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="Password"
                    fullWidth
                    autoComplete="current-password"
                    error={errors.password ? true : false}
                  />
                )}
              />
              <Typography variant="inherit" color="error">
                {errors.password?.message}
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
            Sign Up
          </LoadingButton>
          <Grid container justifyContent="flex-end">
            <Grid item xs>
              <MuiLink
                href={routes.forgot}
                component={NextLink}
                variant="body2"
              >
                Forgot password?
              </MuiLink>
            </Grid>
            <Grid item>
              <MuiLink
                href={routes.signin}
                component={NextLink}
                variant="body2"
              >
                Already have an account? Sign in
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
