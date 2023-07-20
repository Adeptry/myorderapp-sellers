"use client";

import { routes } from "@/app/routes";
import { useNetworkingContext } from "@/components/NetworkingProvider";
import useAccessToken from "@/utils/useAccessToken";
import useRefreshToken from "@/utils/useRefreshToken";
import useRequestState from "@/utils/useRequestState";
import { yupResolver } from "@hookform/resolvers/yup";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { LoadingButton } from "@mui/lab";
import { Alert } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import { default as MuiLink } from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { AuthEmailLoginDto, LoginResponseType } from "moa-merchants-ts-axios";
import { default as NextLink } from "next/link";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

export default function Page() {
  const { auth } = useNetworkingContext();
  const [, setAccessToken] = useAccessToken();
  const [, setRefreshToken] = useRefreshToken();
  const [{ loading, error }, setRequestState] =
    useRequestState<LoginResponseType>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthEmailLoginDto>({
    resolver: yupResolver(
      yup
        .object<AuthEmailLoginDto>()
        .shape({
          email: yup.string().label("Email").required(),
          password: yup.string().label("Password").required(),
        })
        .required()
    ),
  });

  async function handleOnValidSubmit(authEmailLoginDto: AuthEmailLoginDto) {
    try {
      setRequestState({
        data: undefined,
        loading: true,
        error: undefined,
      });
      const response = await auth.login({
        authEmailLoginDto,
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
      <CssBaseline />
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
          Sign in
        </Typography>
        {error && (
          <Alert severity="error">{JSON.stringify(error.response?.data)}</Alert>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit(handleOnValidSubmit)}
          noValidate
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
            Sign In
          </LoadingButton>
          <Grid container>
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
                href={routes.signup}
                component={NextLink}
                variant="body2"
              >
                Don't have an account? Sign up
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
