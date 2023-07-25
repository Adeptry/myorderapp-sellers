import { routes } from "@/app/routes";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useRequestState } from "@/components/networking/useRequestState";
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
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

export function ForgotPasswordForm(props: { preloading: boolean }) {
  const { preloading } = props;
  const { auth } = useNetworkingContext();
  const [{ data, loading, error }, setRequestState] = useRequestState<void>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthForgotPasswordDto>({
    defaultValues: {
      email: "",
    },
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
      const response = await auth.forgotPassword({
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
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit(handleOnValidSubmit)}
      sx={{ width: "100%" }}
    >
      <Grid container spacing={2}>
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error.response?.data.message}</Alert>
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
