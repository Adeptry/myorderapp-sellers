"use client";

import { currentMerchantQueryKey } from "@/queries/useCurrentMerchantQuery";
import { configurationForSession } from "@/utils/configurationForSession";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { yupResolver } from "@hookform/resolvers/yup";
import { Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { UserUpdateDto, UsersApi } from "moa-merchants-ts-axios";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslations } from "use-intl";
import * as yup from "yup";

export type UserUpdateFormType = UserUpdateDto;

export function UserUpdateForm(props: { skeleton?: boolean }) {
  const { skeleton } = props;
  const queryClient = useQueryClient();
  const [errorString, setErrorString] = useState<string | null>(null);
  const common = useTranslations("Common");
  const configuration = useSessionedApiConfiguration();

  const { formState, setError, handleSubmit, control, getValues, reset } =
    useForm<UserUpdateFormType>({
      defaultValues: async () => {
        const session = await getSession();
        const api = new UsersApi(configurationForSession(session));
        const response = await api.getCurrentUser();
        return {
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
        };
      },
      resolver: yupResolver(
        yup
          .object<UserUpdateFormType>({
            email: yup
              .string()
              .min(6)
              .label(common("email"))
              .optional()
              .nullable(),
            firstName: yup
              .string()
              .label(common("firstName"))
              .optional()
              .nullable(),
            lastName: yup
              .string()
              .label(common("lastName"))
              .optional()
              .nullable(),
          })
          .required()
      ),
    });

  const mutation = useMutation({
    mutationFn: async (userUpdateDto: UserUpdateFormType) => {
      return (
        await new UsersApi(configuration).patchCurrentUser({ userUpdateDto })
      ).data;
    },
    onSettled: () => {
      queryClient.invalidateQueries(currentMerchantQueryKey);
    },
  });

  async function handleOnValidSubmit(data: UserUpdateFormType) {
    const dirtyFields = formState.dirtyFields;
    const dirtyObject = Object.keys(dirtyFields).reduce<
      Partial<UserUpdateFormType>
    >((acc, key) => {
      acc[key as keyof UserUpdateFormType] =
        data[key as keyof UserUpdateFormType];
      return acc;
    }, {});

    try {
      const result = await mutation.mutateAsync(dirtyObject);
      reset({
        ...result,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.status === 422) {
        const message = (error?.response?.data as any).message;
        if (typeof message === "string") {
          setErrorString(message);
        } else {
          Object.keys(message).forEach((fieldName) => {
            setError(fieldName as keyof UserUpdateFormType, {
              type: "server",
              message: message[fieldName],
            });
          });
        }
      }
    }
  }

  return (
    <Box
      sx={{ width: "100%" }}
      component="form"
      noValidate
      onSubmit={handleSubmit(handleOnValidSubmit)}
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
            name="firstName"
            control={control}
            render={({ field }) => {
              return skeleton ? (
                <Skeleton height="56px" />
              ) : (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  required
                  fullWidth
                  label={common("firstName")}
                  autoComplete="given-name"
                  inputProps={{
                    autoCorrect: "none",
                    spellCheck: false,
                  }}
                  error={formState.errors.firstName ? true : false}
                  autoFocus
                />
              );
            }}
          />
          <Typography variant="inherit" color="error">
            {formState.errors.firstName?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => {
              return skeleton ? (
                <Skeleton height="56px" />
              ) : (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  required
                  fullWidth
                  label={common("lastName")}
                  autoComplete="family-name"
                  inputProps={{
                    autoCorrect: "none",
                    spellCheck: false,
                  }}
                  error={formState.errors.lastName ? true : false}
                />
              );
            }}
          />
          <Typography variant="inherit" color="error">
            {formState.errors.lastName?.message}
          </Typography>
        </Grid>
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
                  value={field.value ?? ""}
                  required
                  label={common("email")}
                  autoComplete="email"
                  inputProps={{
                    autoCapitalize: "none",
                    autoCorrect: "none",
                    spellCheck: false,
                  }}
                  fullWidth
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
              loading={mutation.isLoading || formState.isSubmitting}
              size="large"
              startIcon={<Save />}
              disabled={mutation.isLoading || !formState.isDirty}
              color="secondary"
              type="submit"
              fullWidth
              variant="contained"
            >
              {common("save")}
            </LoadingButton>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
