"use client";

import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunction } from "@/components/networking/useNetworkingFunction";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Alert } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AppConfig, ConfigUpdateDto } from "moa-merchants-ts-axios";
import { MuiColorInput } from "mui-color-input";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

export function AppConfigForm(props: {
  onSuccess: (appConfig: AppConfig) => void;
  onChange: (field: keyof ConfigUpdateDto, value: string) => void;
}) {
  const { configs } = useNetworkingContext();
  const [{ loading, error }, invoke] = useNetworkingFunction(
    configs.updateConfig.bind(configs)
  );

  const labels = {
    name: "Name",
    seedColor: "Color",
    fontFamily: "Font Family",
    shortDescription: "Short Description",
    fullDescription: "Full Description",
    keywords: "Keywords",
    url: "URL",
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfigUpdateDto>({
    defaultValues: {
      seedColor: "#6750A4",
    },
    resolver: yupResolver(
      yup
        .object<ConfigUpdateDto>()
        .shape({
          name: yup.string().label(labels.name).required(),
          seedColor: yup.string().label(labels.seedColor).required(),
          fontFamily: yup.string().label(labels.fontFamily).required(),
          shortDescription: yup
            .string()
            .label(labels.shortDescription)
            .required(),
          fullDescription: yup
            .string()
            .label(labels.fullDescription)
            .required(),
          keywords: yup.string().label(labels.keywords).required(),
          url: yup.string().label(labels.url).required(),
        })
        .required()
    ),
  });

  async function handleOnValidSubmit(configUpdateDto: ConfigUpdateDto) {
    try {
      const response = await invoke({ configUpdateDto });
      const data = response?.data;
      if (!data) {
        throw new Error("App config not updated");
      }
      props.onSuccess(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleOnValidSubmit)}
      noValidate
    >
      {error && (
        <Alert severity="error">{JSON.stringify(error.response?.data)}</Alert>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                label={labels.name}
                onChange={(event) => {
                  props.onChange("name", event.target.value);
                  field.onChange(event);
                }}
                fullWidth
                autoFocus
                error={errors.name ? true : false}
              />
            )}
          />
          <Typography variant="inherit" color="error">
            {errors.name?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="seedColor"
            control={control}
            render={({ field }) => (
              <MuiColorInput
                {...field}
                fullWidth
                format="hex"
                isAlphaHidden
                label={labels.seedColor}
                error={errors.seedColor ? true : false}
                required
                onChange={(value) => {
                  props.onChange("seedColor", value);
                  field.onChange({
                    target: {
                      value,
                    },
                  });
                }}
              />
            )}
          />
          <Typography variant="inherit" color="error">
            {errors.seedColor?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="fontFamily"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                onChange={(event) => {
                  props.onChange("fontFamily", event.target.value);
                  field.onChange(event);
                }}
                label={labels.fontFamily}
                fullWidth
                error={errors.fontFamily ? true : false}
              />
            )}
          />
          <Typography variant="inherit" color="error">
            {errors.fontFamily?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="shortDescription"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={labels.shortDescription}
                fullWidth
                error={errors.shortDescription ? true : false}
              />
            )}
          />
          <Typography variant="inherit" color="error">
            {errors.shortDescription?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="fullDescription"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                multiline
                rows={4}
                label={labels.fullDescription}
                fullWidth
                error={errors.fullDescription ? true : false}
              />
            )}
          />
          <Typography variant="inherit" color="error">
            {errors.fullDescription?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="keywords"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={labels.keywords}
                fullWidth
                error={errors.keywords ? true : false}
              />
            )}
          />
          <Typography variant="inherit" color="error">
            {errors.keywords?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="url"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={labels.url}
                fullWidth
                error={errors.url ? true : false}
              />
            )}
          />
          <Typography variant="inherit" color="error">
            {errors.url?.message}
          </Typography>
        </Grid>
      </Grid>

      <LoadingButton
        loading={loading}
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
      >
        Create app
      </LoadingButton>
    </Box>
  );
}
/* 
Description
Keywords
Category
Rating

Support URL
*/
