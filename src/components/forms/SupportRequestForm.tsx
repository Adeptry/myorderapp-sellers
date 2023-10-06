import { usePostSupportMutation } from "@/networking/mutations/usePostSupportMutation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Send } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { SupportRequestPostBody } from "myorderapp-square";
import { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslations } from "use-intl";
import * as yup from "yup";

export function SupportRequestForm() {
  type FormType = SupportRequestPostBody;

  const [errorString, setErrorString] = useState<string | null>(null);
  const t = useTranslations("SupportRequestForm");
  const [successState, setSuccessState] = useState<boolean>(false);

  const { formState, setError, handleSubmit, control, reset, watch } =
    useForm<FormType>({
      resolver: yupResolver<FormType>(
        yup
          .object<FormType>()
          .shape({
            subject: yup.string().required().label(t("subjectField")),
            text: yup.string().required().label(t("textField")),
          })
          .required()
      ),
    });

  useEffect(() => {
    const subscription = watch(() => setErrorString(null));
    return () => subscription.unsubscribe();
  }, [watch()]);

  const mutation = usePostSupportMutation();

  async function handleOnValidSubmit(supportRequestPostBody: FormType) {
    try {
      await mutation.mutateAsync({ supportRequestPostBody });
      setSuccessState(true);
      reset();
    } catch (error) {
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
  }

  return (
    <Fragment>
      <Box
        sx={{ width: "100%" }}
        component="form"
        noValidate
        onSubmit={handleSubmit(handleOnValidSubmit)}
      >
        <Grid container columnSpacing={2} rowSpacing={2}>
          {errorString && (
            <Grid item xs={12}>
              <Alert severity="error" style={{ width: "100%" }}>
                {errorString}
              </Alert>
            </Grid>
          )}
          {successState && (
            <Grid item xs={12}>
              <Alert
                style={{ width: "100%" }}
                onClose={() => setSuccessState(false)}
                severity="success"
              >
                {t("successAlert")}
              </Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    value={field.value ?? ""}
                    required
                    fullWidth
                    placeholder={t("subjectPlaceholder")}
                    label={t("subjectField")}
                    error={formState.errors.subject ? true : false}
                    autoFocus
                  />
                );
              }}
            />
            <Typography variant="inherit" color="error">
              {formState.errors.subject?.message}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="text"
              control={control}
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    value={field.value ?? ""}
                    required
                    multiline
                    fullWidth
                    rows={4}
                    placeholder={t("textPlaceholder")}
                    label={t("textField")}
                    error={formState.errors.text ? true : false}
                  />
                );
              }}
            />
            <Typography variant="inherit" color="error">
              {formState.errors.text?.message}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box textAlign="center">
              <LoadingButton
                loading={mutation.isLoading || formState.isSubmitting}
                size="large"
                startIcon={<Send />}
                disabled={mutation.isLoading || !formState.isDirty}
                color="secondary"
                type="submit"
                variant="contained"
              >
                {t("buttonText")}
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
}
