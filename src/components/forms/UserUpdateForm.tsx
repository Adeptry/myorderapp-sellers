import { routes } from "@/app/routes";
import { useGetMerchantMeQuery } from "@/networking/queries/useGetMerchantMeQuery";
import { configurationForSession } from "@/utils/configurationForSession";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { yupResolver } from "@hookform/resolvers/yup";
import { Save, Warning } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { UserPatchBody, UsersApi } from "myorderapp-square";
import { getSession, signOut } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslations } from "use-intl";
import * as yup from "yup";
import { useDeleteMerchantMeMutation } from "@/networking/mutations/useDeleteMerchantMeMutation";
import { SquareOauthButton } from "../buttons/SquareOauthButton";
import { DeleteMerchantMeDialog } from "../dialogs/DeleteMerchantMeDialog";

export type UserUpdateFormType = UserPatchBody;

export function UserUpdateForm() {
  const [skeletonState, setSkeletonState] = useState<boolean>(true);
  const [errorString, setErrorString] = useState<string | null>(null);
  const t = useTranslations("UserUpdateForm");
  const configuration = useSessionedApiConfiguration();
  const currentMerchantQuery = useGetMerchantMeQuery();
  const [showDeleteDialogState, setShowDeleteDialogState] =
    useState<boolean>(false);

  const { formState, setError, handleSubmit, control, reset, watch } =
    useForm<UserUpdateFormType>({
      defaultValues: async () => {
        const session = await getSession();
        const api = new UsersApi(configurationForSession(session));
        const response = await api.getUserMe();
        setSkeletonState(false);
        return {
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
        };
      },
      resolver: yupResolver(
        yup
          .object<UserUpdateFormType>({
            email: yup.string().min(6).label(t("email")).optional().nullable(),
            firstName: yup.string().label(t("firstName")).optional().nullable(),
            lastName: yup.string().label(t("lastName")).optional().nullable(),
          })
          .required()
      ),
    });

  useEffect(() => {
    const subscription = watch(() => setErrorString(null));
    return () => subscription.unsubscribe();
  }, [watch()]);

  const patchUserMeMutation = useMutation({
    mutationFn: async (userPatchBody: UserUpdateFormType) => {
      return (await new UsersApi(configuration).patchUserMe({ userPatchBody }))
        .data;
    },
    onSettled: () => {
      currentMerchantQuery.refetch();
    },
  });

  const deleteMerchantMeMutation = useDeleteMerchantMeMutation();

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
      const result = await patchUserMeMutation.mutateAsync(dirtyObject);
      reset({
        ...result,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const fields = (error?.response?.data as any)?.fields;
        if (fields !== undefined) {
          Object.keys(fields).forEach((fieldName) => {
            setError(fieldName as keyof UserUpdateFormType, {
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
  }

  return (
    <Fragment>
      <Box
        sx={{ width: "100%" }}
        component="form"
        noValidate
        onSubmit={handleSubmit(handleOnValidSubmit)}
      >
        <Grid
          container
          columnSpacing={skeletonState ? 1 : 2}
          rowSpacing={skeletonState ? 0 : 2}
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
                return skeletonState ? (
                  <Skeleton height="72px" />
                ) : (
                  <TextField
                    {...field}
                    value={field.value ?? ""}
                    required
                    fullWidth
                    label={t("firstName")}
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
                return skeletonState ? (
                  <Skeleton height="72px" />
                ) : (
                  <TextField
                    {...field}
                    value={field.value ?? ""}
                    required
                    fullWidth
                    label={t("lastName")}
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
                return skeletonState ? (
                  <Skeleton height="72px" />
                ) : (
                  <TextField
                    {...field}
                    value={field.value ?? ""}
                    required
                    label={t("email")}
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
            {skeletonState ? (
              <Skeleton height="58px" width="100%" />
            ) : (
              <LoadingButton
                loading={
                  patchUserMeMutation.isPending || formState.isSubmitting
                }
                size="large"
                startIcon={<Save />}
                disabled={patchUserMeMutation.isPending || !formState.isDirty}
                color="secondary"
                type="submit"
                fullWidth
                variant="contained"
              >
                {t("saveButton")}
              </LoadingButton>
            )}
          </Grid>

          <Grid item xs={12} textAlign="center">
            {skeletonState ? (
              <Skeleton height="58px" width="100%" />
            ) : (
              <SquareOauthButton />
            )}
          </Grid>
          <Grid item xs={12} textAlign="center">
            {skeletonState ? (
              <Skeleton height="58px" width="100%" />
            ) : (
              <Button
                color="error"
                variant="contained"
                startIcon={<Warning />}
                onClick={() => setShowDeleteDialogState(true)}
              >
                {t("deleteButton")}
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
      <DeleteMerchantMeDialog
        open={showDeleteDialogState}
        onClose={async (confirmed) => {
          setShowDeleteDialogState(false);
          if (confirmed) {
            deleteMerchantMeMutation.mutateAsync();
            await signOut({ callbackUrl: routes.login });
          }
        }}
      />
    </Fragment>
  );
}
