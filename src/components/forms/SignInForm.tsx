"use client";

import { routes } from "@/app/routes";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunction } from "@/components/networking/useNetworkingFunction";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Alert } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { default as MuiLink } from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AuthEmailLoginDto } from "moa-merchants-ts-axios";
import { default as NextLink } from "next/link";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

export function SignInForm(props: { onSuccess: () => void }) {
  const { auth, setSession } = useNetworkingContext();
  const [{ loading, error }, invoke] = useNetworkingFunction(
    auth.createSession.bind(auth)
  );

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
      const response = await invoke({ authEmailLoginDto });
      const data = response?.data;
      if (!data) {
        throw new Error("No access token");
      }
      setSession(data);
      props.onSuccess();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleOnValidSubmit)}
      noValidate
      sx={{ mt: 3 }}
    >
      {error && (
        <Alert severity="error">{JSON.stringify(error.response?.data)}</Alert>
      )}
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
          <MuiLink href={routes.forgot} component={NextLink} variant="body2">
            Forgot password?
          </MuiLink>
        </Grid>
        <Grid item>
          <MuiLink href={routes.signup} component={NextLink} variant="body2">
            Don't have an account? Sign up
          </MuiLink>
        </Grid>
      </Grid>
    </Box>
  );
}
