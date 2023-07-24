"use client";

import { routes } from "@/app/routes";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunction } from "@/components/networking/useNetworkingFunction";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Alert, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import { default as MuiLink } from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AuthRegisterLoginDto, Merchant } from "moa-merchants-ts-axios";
import { default as NextLink } from "next/link";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

export function SignUpForm(props: { onSuccess: (merchant: Merchant) => void }) {
  const { auth, merchants, setSession } = useNetworkingContext();
  const [{ loading: createUserLoading, error: createUserError }, createUser] =
    useNetworkingFunction(auth.createUser.bind(auth));
  const [
    { loading: createMerchantLoading, error: createMerchantError },
    createMerchant,
  ] = useNetworkingFunction(merchants.createMerchant.bind(merchants));

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthRegisterLoginDto>({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
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
      const registerResponse = await createUser({
        authRegisterLoginDto,
      });
      const data = registerResponse?.data;
      if (!data) {
        throw new Error("No access token");
      }
      setSession(data);
      const merchantResponse = await createMerchant({
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      if (merchantResponse?.data !== undefined) {
        props.onSuccess(merchantResponse.data);
      } else {
        throw new Error("No merchant response");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const error = createUserError || createMerchantError;
  const loading = createUserLoading || createMerchantLoading;

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      mt={3}
      spacing={2}
      component="form"
      noValidate
      onSubmit={handleSubmit(handleOnValidSubmit)}
    >
      {error && (
        <Alert severity="error">{JSON.stringify(error.response?.data)}</Alert>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                id="firstName"
                {...field}
                required
                fullWidth
                label="First Name"
                autoComplete="given-name"
                error={errors.firstName ? true : false}
                autoFocus
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
                id="lastName"
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
                id="email"
                label="Email"
                fullWidth
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
                id="password"
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
        id="sign-up-button"
        loading={loading}
        type="submit"
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign Up
      </LoadingButton>
      <Grid container justifyContent="flex-end">
        <Grid item xs>
          <MuiLink href={routes.forgot} component={NextLink} variant="body2">
            Forgot password?
          </MuiLink>
        </Grid>
        <Grid item>
          <MuiLink href={routes.signin} component={NextLink} variant="body2">
            Already have an account? Sign in
          </MuiLink>
        </Grid>
      </Grid>
    </Stack>
  );
}
