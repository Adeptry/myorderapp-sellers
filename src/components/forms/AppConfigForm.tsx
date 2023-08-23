"use client";

import { fontNames } from "@/data/fontNames";
import { mapStringEnum } from "@/utils/mapStringEnum";
import { toPascalCase } from "@/utils/toPascalCase";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { yupResolver } from "@hookform/resolvers/yup";
import { Check, Create } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { default as MuiLink } from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  AppConfig,
  AppConfigUpdateDto,
  AppConfigUpdateDtoThemeModeEnum,
  ConfigsApiFp,
  ThemeModeEnum,
} from "moa-merchants-ts-axios";
import { MuiColorInput } from "mui-color-input";
import { MuiFileInput } from "mui-file-input";
import { default as NextLink } from "next/link";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import DevicePreview from "../DevicePreview";
import { TabLayout } from "../layouts/TabLayout";

export function AppConfigForm(props: {
  preloading?: boolean;
  submitText: string;
  shouldAutoFocus?: boolean;
  defaultValues?: AppConfigUpdateDto;
  onSuccess: (appConfig: AppConfig) => void;
}) {
  const { submitText, onSuccess, shouldAutoFocus, defaultValues } = props;
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(780));

  const labels = {
    name: "Name",
    seedColor: "Color",
    fontFamily: "Font Family",
    themeMode: "Color Mode",
    appearance: "Appearance",
  };

  const { configuration } = useSessionedApiConfiguration();

  const updateConfigMutation = useMutation({
    mutationFn: async (appConfigUpdateDto: AppConfigUpdateDto) => {
      return (
        await ConfigsApiFp(configuration).updateConfig(appConfigUpdateDto)
      )();
    },
  });

  const form = useForm<AppConfigUpdateDto>({
    defaultValues: defaultValues,
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
          useMaterial3: yup.boolean().required(),
          themeMode: yup.mixed<AppConfigUpdateDtoThemeModeEnum>().required(),
        })
        .required()
    ),
  });

  const [fontInputState, setFontInputState] = useState("");

  const [appIconFileValue, setAppIconFileValue] = useState<File | null>(null);

  const handleFileChange = (newValue: File | null) => {
    setAppIconFileValue(newValue);
    if (newValue) {
      // configs.uploadIcon({ file: newValue });
    }
  };

  const onChange = (name: keyof AppConfigUpdateDto, value: any) => {
    iframeRef.current?.contentWindow?.postMessage({ [name]: value }, "*");
  };

  async function handleOnValidSubmit(data: AppConfigUpdateDto) {
    try {
      const response = await updateConfigMutation.mutateAsync(data);

      if (!response.data) {
        throw new Error("App config not updated");
      }
      onSuccess(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.status === 422) {
        const serverErrors = (error?.response?.data as any).message;
        Object.keys(serverErrors).forEach((fieldName) => {
          form.setError(fieldName as keyof AppConfigUpdateDto, {
            type: "server",
            message: serverErrors[fieldName],
          });
        });
      }
    }
  }

  function submitButton(): JSX.Element {
    return (
      <Box textAlign="center">
        <LoadingButton
          size="large"
          variant="contained"
          color="secondary"
          type="submit"
          loading={
            updateConfigMutation.isLoading || form.formState.isSubmitting
          }
          disabled={
            (updateConfigMutation.isLoading || updateConfigMutation.data) &&
            true
          }
          startIcon={form.formState.isSubmitSuccessful ? <Check /> : <Create />}
        >
          {form.formState.isSubmitSuccessful ? "Nice!" : submitText}
        </LoadingButton>
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={form.handleSubmit(handleOnValidSubmit)}
      sx={{ width: "100%" }}
      noValidate
    >
      <TabLayout
        tabLabels={["Options", "Preview"]}
        sx={{ pt: isSmallScreen ? 0 : 3, pb: 3 }}
      >
        <Grid container columnSpacing={2} rowSpacing={2}>
          <Grid item xs={12}>
            <Controller
              name="name"
              control={form.control}
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    required
                    helperText={
                      !form.formState.errors.name?.message &&
                      "The name of your app"
                    }
                    label={labels.name}
                    inputProps={{
                      autoCorrect: "none",
                      spellCheck: false,
                    }}
                    onChange={(event) => {
                      onChange("name", event.target.value);
                      field.onChange(event);
                    }}
                    fullWidth
                    autoFocus={shouldAutoFocus}
                    error={form.formState.errors.name ? true : false}
                  />
                );
              }}
            />
            <Typography variant="inherit" color="error">
              {form.formState.errors.name?.message}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <MuiFileInput
              fullWidth
              value={appIconFileValue}
              onChange={handleFileChange}
              helperText="Will appear on users' homepage"
              label="App icon"
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="seedColor"
              control={form.control}
              render={({ field }) => {
                return (
                  <MuiColorInput
                    onBlur={() => field.onBlur()}
                    value={field.value ?? ""}
                    name={field.name}
                    ref={field.ref}
                    fullWidth
                    helperText={
                      !form.formState.errors.seedColor?.message &&
                      "Used to generate your theme"
                    }
                    format="hex"
                    isAlphaHidden
                    label={labels.seedColor}
                    error={form.formState.errors.seedColor ? true : false}
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
              {form.formState.errors.seedColor?.message}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="fontFamily"
              control={form.control}
              render={({ field }) => {
                return (
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
                    {!form.formState.errors.fontFamily?.message && (
                      <FormHelperText>
                        From{" "}
                        <MuiLink
                          color="secondary"
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
              {form.formState.errors.fontFamily?.message}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="themeMode"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormControl>
                    <FormLabel>{labels.themeMode}</FormLabel>
                    <RadioGroup
                      {...field}
                      onChange={(event) => {
                        onChange("themeMode", event.target.value);
                        field.onChange(event);
                      }}
                      row
                    >
                      {mapStringEnum(ThemeModeEnum, (value) => {
                        return (
                          <FormControlLabel
                            key={value}
                            checked={field.value === value}
                            value={value}
                            control={<Radio />}
                            label={toPascalCase(value)}
                          />
                        );
                      })}
                    </RadioGroup>
                    <FormHelperText>
                      'System' follows user settings. Select 'Light' or 'Dark'
                      to override.
                    </FormHelperText>
                  </FormControl>
                );
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="useMaterial3"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      {labels.appearance}
                    </FormLabel>
                    <RadioGroup
                      {...field}
                      onChange={(event) => {
                        onChange("useMaterial3", `${event.target.value}`);
                        field.onChange(event);
                      }}
                      row
                    >
                      <FormControlLabel
                        key={"modern"}
                        value={true}
                        control={<Radio />}
                        label={"Modern"}
                      />
                      <FormControlLabel
                        key={"classic"}
                        value={false}
                        control={<Radio />}
                        label={"Classic"}
                      />
                    </RadioGroup>
                  </FormControl>
                );
              }}
            />
          </Grid>
          {!isSmallScreen && (
            <Grid item xs={12}>
              {submitButton()}
            </Grid>
          )}
        </Grid>
        <DevicePreview
          iframeRef={iframeRef}
          key="device-preview"
          sx={{ pb: 2 }}
        />
      </TabLayout>
      {isSmallScreen && submitButton()}
    </Box>
  );
}
