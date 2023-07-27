"use client";

import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunction } from "@/components/networking/useNetworkingFunction";
import { fontNames } from "@/data/fontNames";
import { yupResolver } from "@hookform/resolvers/yup";
import { Check } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  Skeleton,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { default as MuiLink } from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { AppConfig, AppConfigUpdateDto } from "moa-merchants-ts-axios";
import { MuiColorInput } from "mui-color-input";
import { MuiFileInput } from "mui-file-input";
import { default as NextLink } from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

export function AppConfigForm(props: {
  preloading?: boolean;
  submitText: string;
  shouldAutoFocus?: boolean;
  defaultValues?: AppConfigUpdateDto;
  onSuccess: (appConfig: AppConfig) => void;
  onChange: (field: keyof AppConfigUpdateDto, value: string) => void;
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

  const [{ loading }, invoke] = useNetworkingFunction(
    configs.updateConfig.bind(configs)
  );

  const labels = {
    name: "Name",
    seedColor: "Color",
    fontFamily: "Font Family",
  };

  const { control, handleSubmit, setError, formState } =
    useForm<AppConfigUpdateDto>({
      defaultValues: {
        seedColor: "#6750A4",
        name: "",
        fontFamily: "Roboto",
      },
      values: defaultValues,
      resolver: yupResolver<AppConfigUpdateDto>(
        yup
          .object<AppConfigUpdateDto>()
          .shape({
            name: yup.string().min(3).label(labels.name).required(),
            seedColor: yup
              .string()
              .matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/)
              .label(labels.seedColor)
              .required("Must be a hex color"),
            fontFamily: yup.string().label(labels.fontFamily).required(),
            shortDescription: yup.string().optional(),
            fullDescription: yup.string().optional(),
            keywords: yup.string().optional(),
            url: yup.string().optional(),
          })
          .required()
      ),
    });

  const [fontInputState, setFontInputState] = useState("");

  const [appIconFileValue, setAppIconFileValue] = useState<File | null>(null);

  const handleFileChange = (newValue: File | null) => {
    setAppIconFileValue(newValue);
    if (newValue) {
      configs.uploadIcon({ file: newValue });
    }
  };

  async function handleOnValidSubmit(appConfigUpdateDto: AppConfigUpdateDto) {
    try {
      const response = await invoke({ appConfigUpdateDto });
      const data = response?.data;
      if (!data) {
        throw new Error("App config not updated");
      }
      onSuccess(data);
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.status === 422) {
        const serverErrors = error?.response?.data.message;
        Object.keys(serverErrors).forEach((fieldName) => {
          setError(fieldName as keyof AppConfigUpdateDto, {
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
      sx={{ width: "100%" }}
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
                  helperText={
                    !formState.errors.name?.message && "The name of your app"
                  }
                  label={labels.name}
                  inputProps={{
                    autoCapitalize: "none",
                    autoCorrect: "none",
                    spellCheck: false,
                  }}
                  onChange={(event) => {
                    onChange("name", event.target.value);
                    field.onChange(event);
                  }}
                  fullWidth
                  autoFocus={shouldAutoFocus}
                  error={formState.errors.name ? true : false}
                />
              );
            }}
          />
          <Typography variant="inherit" color="error">
            {formState.errors.name?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {preloading ? (
            <Skeleton height="92px" />
          ) : (
            <MuiFileInput
              fullWidth
              value={appIconFileValue}
              onChange={handleFileChange}
              helperText="Will appear on users' homepage"
              label="App icon"
            />
          )}
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
                  onBlur={() => field.onBlur()}
                  value={field.value ?? ""}
                  name={field.name}
                  ref={field.ref}
                  fullWidth
                  helperText={
                    !formState.errors.seedColor?.message &&
                    "Used to generate your theme"
                  }
                  format="hex"
                  isAlphaHidden
                  label={labels.seedColor}
                  error={formState.errors.seedColor ? true : false}
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
            {formState.errors.seedColor?.message}
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
                  <Autocomplete
                    value={field.value}
                    disablePortal
                    onChange={(event: any, newValue: string | null) => {
                      if (newValue) {
                        onChange("fontFamily", newValue);
                        field.onChange({
                          target: {
                            value: newValue,
                          },
                        });
                      }
                    }}
                    inputValue={fontInputState}
                    onInputChange={(event, newInputValue) => {
                      setFontInputState(newInputValue);
                    }}
                    fullWidth
                    options={fontNames}
                    renderInput={(params) => (
                      <TextField {...params} name={field.name} label="Font" />
                    )}
                    renderOption={(props, option) => {
                      return (
                        <li {...props} key={option}>
                          {option}
                        </li>
                      );
                    }}
                  />
                  {!formState.errors.fontFamily?.message && (
                    <FormHelperText>
                      From{" "}
                      <MuiLink
                        target="_blank"
                        rel="noopener noreferrer"
                        href={"https://fonts.google.com"}
                        component={NextLink}
                      >
                        Google Fonts
                      </MuiLink>
                      .
                    </FormHelperText>
                  )}
                </FormControl>
              );
            }}
          />
          <Typography variant="inherit" color="error">
            {formState.errors.fontFamily?.message}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          {preloading ? (
            <Skeleton height="92px" />
          ) : (
            <LoadingButton
              loading={loading || formState.isSubmitting}
              size="large"
              startIcon={formState.isSubmitSuccessful ? <Check /> : null}
              color={formState.isSubmitSuccessful ? "success" : "primary"}
              type="submit"
              fullWidth
              variant="contained"
            >
              {formState.isSubmitSuccessful ? "" : submitText}
            </LoadingButton>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
