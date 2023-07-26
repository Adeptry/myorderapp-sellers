"use client";

import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunction } from "@/components/networking/useNetworkingFunction";
import { fonts } from "@/data/fonts";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { default as MuiLink } from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { AppConfig, ConfigUpdateDto } from "moa-merchants-ts-axios";
import { MuiColorInput } from "mui-color-input";
import { default as NextLink } from "next/link";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const injectFont = (fontName: string, fontURL: string) => {};

export function AppConfigForm(props: {
  preloading?: boolean;
  submitText: string;
  shouldAutoFocus?: boolean;
  defaultValues?: ConfigUpdateDto;
  onSuccess: (appConfig: AppConfig) => void;
  onChange: (field: keyof ConfigUpdateDto, value: string) => void;
}) {
  const {
    submitText,
    onSuccess,
    onChange,
    preloading,
    shouldAutoFocus,
    defaultValues,
  } = props;
  const { configs } = useNetworkingContext();

  useEffect(() => {
    fonts.forEach((font) => {
      const fontFace = new FontFace(font.fontFamily, `url(${font.regularUrl})`);
      console.log(`loading ${font.fontFamily}`);
      fontFace.load().then((loadedFace) => {
        document.fonts.add(loadedFace);
      });
    });
  }, []);

  const [{ loading }, invoke] = useNetworkingFunction(
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
    setError,
    formState: { errors },
  } = useForm<ConfigUpdateDto>({
    defaultValues: {
      seedColor: "#6750A4",
      name: "",
      fontFamily: "",
      shortDescription: "",
      fullDescription: "",
      keywords: "",
      url: "",
    },
    values: defaultValues,
    resolver: yupResolver(
      yup
        .object<ConfigUpdateDto>()
        .shape({
          name: yup.string().min(3).label(labels.name).required(),
          seedColor: yup
            .string()
            .matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/)
            .label(labels.seedColor)
            .required("Must be a hex color"),
          fontFamily: yup.string().label(labels.fontFamily).required(),
          shortDescription: yup
            .string()
            .min(3)
            .max(30)
            .label(labels.shortDescription)
            .required(),
          fullDescription: yup
            .string()
            .min(3)
            .max(4000)
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
      onSuccess(data);
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.status === 422) {
        const serverErrors = error?.response?.data.message;
        Object.keys(serverErrors).forEach((fieldName) => {
          setError(fieldName as keyof ConfigUpdateDto, {
            type: "server",
            message: serverErrors[fieldName],
          });
        });
      }
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleOnValidSubmit)}
      noValidate
    >
      <Grid
        container
        columnSpacing={preloading ? 1 : 2}
        rowSpacing={preloading ? 0 : 2}
      >
        <Grid item xs={12}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => {
              return preloading ? (
                <Skeleton height="92px" />
              ) : (
                <TextField
                  {...field}
                  required
                  helperText={!errors.name?.message && "The name of your app."}
                  label={labels.name}
                  onChange={(event) => {
                    onChange("name", event.target.value);
                    field.onChange(event);
                  }}
                  fullWidth
                  autoFocus={shouldAutoFocus}
                  error={errors.name ? true : false}
                />
              );
            }}
          />
          <Typography variant="inherit" color="error">
            {errors.name?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="seedColor"
            control={control}
            render={({ field }) => {
              return preloading ? (
                <Skeleton height="92px" />
              ) : (
                <MuiColorInput
                  {...field}
                  fullWidth
                  helperText={
                    !errors.seedColor?.message && "Used to generate your theme"
                  }
                  format="hex"
                  isAlphaHidden
                  label={labels.seedColor}
                  error={errors.seedColor ? true : false}
                  required
                  onChange={(value) => {
                    onChange("seedColor", value);
                    field.onChange({
                      target: {
                        value,
                      },
                    });
                  }}
                />
              );
            }}
          />
          <Typography variant="inherit" color="error">
            {errors.seedColor?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="fontFamily"
            control={control}
            render={({ field }) => {
              return preloading ? (
                <Skeleton height="92px" />
              ) : (
                <FormControl fullWidth>
                  <InputLabel id="font-family-select-label">
                    {labels.fontFamily}
                  </InputLabel>
                  <Select
                    labelId="font-family-select-label"
                    {...field}
                    onChange={(event) => {
                      onChange("fontFamily", event.target.value);
                      field.onChange(event);
                    }}
                    label={labels.fontFamily}
                    fullWidth
                    required
                    error={errors.fontFamily ? true : false}
                  >
                    {fonts.map((font) => {
                      return (
                        <MenuItem
                          value={font.fontFamily}
                          style={{ fontFamily: font.fontFamily }}
                        >
                          {font.fontFamily}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              );
            }}
          />
          <Typography variant="inherit" color="error">
            {errors.fontFamily?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="shortDescription"
            control={control}
            render={({ field }) => {
              return preloading ? (
                <Skeleton height="92px" />
              ) : (
                <TextField
                  {...field}
                  required
                  helperText={
                    !errors.shortDescription?.message && "Product page subtitle"
                  }
                  label={labels.shortDescription}
                  fullWidth
                  error={errors.shortDescription ? true : false}
                />
              );
            }}
          />
          <Typography variant="inherit" color="error">
            {errors.shortDescription?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="fullDescription"
            control={control}
            render={({ field }) => {
              return preloading ? (
                <Skeleton height="164px" />
              ) : (
                <TextField
                  {...field}
                  multiline
                  required
                  rows={4}
                  helperText={
                    !errors.fullDescription?.message && (
                      <>
                        Some info from{" "}
                        <MuiLink
                          target="_blank"
                          rel="noopener noreferrer"
                          href={
                            "https://developer.apple.com/app-store/product-page/"
                          }
                          component={NextLink}
                        >
                          Apple
                        </MuiLink>{" "}
                        &{" "}
                        <MuiLink
                          target="_blank"
                          rel="noopener noreferrer"
                          href={
                            "https://support.google.com/googleplay/android-developer/answer/9898842"
                          }
                          component={NextLink}
                        >
                          Google
                        </MuiLink>
                      </>
                    )
                  }
                  label={labels.fullDescription}
                  fullWidth
                  error={errors.fullDescription ? true : false}
                />
              );
            }}
          />
          <Typography variant="inherit" color="error">
            {errors.fullDescription?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="keywords"
            control={control}
            render={({ field }) => {
              return preloading ? (
                <Skeleton height="92px" />
              ) : (
                <TextField
                  {...field}
                  helperText={!errors.keywords?.message && "Comma separated"}
                  label={labels.keywords}
                  required
                  fullWidth
                  error={errors.keywords ? true : false}
                />
              );
            }}
          />
          <Typography variant="inherit" color="error">
            {errors.keywords?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="url"
            control={control}
            render={({ field }) => {
              return preloading ? (
                <Skeleton height="92px" />
              ) : (
                <TextField
                  {...field}
                  helperText={
                    !errors.url?.message &&
                    "Can be marketing, support, or social media"
                  }
                  required
                  label={labels.url}
                  fullWidth
                  error={errors.url ? true : false}
                />
              );
            }}
          />
          <Typography variant="inherit" color="error">
            {errors.url?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {preloading ? (
            <Skeleton height="92px" />
          ) : (
            <LoadingButton
              loading={loading}
              size="large"
              type="submit"
              fullWidth
              variant="contained"
            >
              {submitText}
            </LoadingButton>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
