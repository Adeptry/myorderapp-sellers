"use client";

import { fontNames } from "@/data/fontNames";
import { configurationForSession } from "@/utils/configurationForSession";
import { mapStringEnum } from "@/utils/mapStringEnum";
import { randomColor } from "@/utils/randomColor";
import { stringToColor } from "@/utils/stringToColor";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { yupResolver } from "@hookform/resolvers/yup";
import { Save } from "@mui/icons-material";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
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
  MerchantsApiFp,
  ThemeModeEnum,
} from "moa-merchants-ts-axios";
import { MuiColorInput } from "mui-color-input";
import { MuiFileInput } from "mui-file-input";
import { getSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { default as NextLink } from "next/link";
import { useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { Controller, useForm } from "react-hook-form";

import * as yup from "yup";

export function AppConfigForm(props: {
  buttonOnTop?: boolean;
  submitButtonText?: string;
  successUrl?: string;
  onChange?: (appConfig: AppConfig) => void;
}) {
  const { onChange, submitButtonText, successUrl } = props;
  const { push } = useRouter();
  const theme = useTheme();
  const t = useTranslations("AppConfigForm");
  const common = useTranslations("Common");

  const { configuration } = useSessionedApiConfiguration();
  const [skeletonState, setSkeletonState] = useState(true);

  const updateConfigMutation = useMutation({
    mutationFn: async (appConfigUpdateDto: AppConfigUpdateDto) => {
      return (
        await (
          await ConfigsApiFp(configuration).updateConfig(appConfigUpdateDto)
        )()
      ).data;
    },
  });

  const form = useForm<AppConfigUpdateDto>({
    defaultValues: async () => {
      const session = await getSession();

      if (session) {
        try {
          const myConfigResponse = await (
            await ConfigsApiFp(configurationForSession(session)).getMyConfig(
              undefined,
              "merchant"
            )
          )();
          const myConfig = myConfigResponse.data;
          onChange ? onChange(myConfig) : {};
          return {
            name: myConfig.name ?? "",
            seedColor: myConfig.seedColor ?? "#",
            fontFamily: myConfig.fontFamily ?? "Roboto",
            themeMode: myConfig.themeMode ?? ThemeModeEnum.Light,
            useMaterial3: myConfig.useMaterial3 ?? false,
          };
        } catch (error) {
          const currentMerchantResponse = await (
            await MerchantsApiFp(
              configurationForSession(session)
            ).getCurrentMerchant()
          )();
          const currentMerchant = currentMerchantResponse?.data;
          const currentUser = currentMerchant?.user;
          const firstName = currentUser?.firstName;
          const lastName = currentUser?.lastName;
          const fullName = `${firstName ?? ""} ${lastName ?? ""}`;
          return {
            name: `${firstName}'s App`,
            seedColor: stringToColor(fullName),
            fontFamily: "Roboto",
            themeMode: ThemeModeEnum.Light,
            useMaterial3: false,
          };
        } finally {
          setSkeletonState(false);
        }
      } else {
        throw new Error("Session data not available");
      }
    },
    resolver: yupResolver<AppConfigUpdateDto>(
      yup
        .object<AppConfigUpdateDto>()
        .shape({
          name: yup.string().min(3).label(t("nameLabel")).required(),
          seedColor: yup
            .string()
            .matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/)
            .label(t("seedColorLabel"))
            .required("Must be a hex color"),
          fontFamily: yup.string().label(t("fontFamilyLabel")).required(),
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

  const randomFont = () => {
    return fontNames[Math.floor(Math.random() * fontNames.length)];
  };

  const handleFileChange = (newValue: File | null) => {
    setAppIconFileValue(newValue);
    if (newValue) {
      // configs.uploadIcon({ file: newValue });
    }
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      onChange ? onChange(value) : {};
    });
    return () => subscription.unsubscribe();
  }, [form.watch()]);

  async function handleOnValidSubmit(data: AppConfigUpdateDto) {
    try {
      const response = await updateConfigMutation.mutateAsync(data);

      if (!response) {
        throw new Error("App config not updated");
      }

      if (successUrl) {
        push(successUrl);
      }
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

  const submitButton = (
    <Grid item xs={12}>
      {skeletonState ? (
        <Skeleton height="56px" />
      ) : (
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={1}
        >
          <LoadingButton
            loading={
              updateConfigMutation.isLoading || form.formState.isSubmitting
            }
            size="large"
            startIcon={<Save />}
            disabled={updateConfigMutation.isLoading}
            color="secondary"
            type="submit"
            variant="contained"
          >
            {successUrl ? common("saveAndContinue") : t("submitButtonText")}
          </LoadingButton>
          <Typography
            variant="caption"
            style={{ color: theme.palette.text.secondary }}
          >
            {t("submitButtonCaption")}
          </Typography>
        </Stack>
      )}
    </Grid>
  );

  return (
    <Box
      component="form"
      onSubmit={form.handleSubmit(handleOnValidSubmit)}
      sx={{ width: "100%" }}
      noValidate
    >
      <Grid container columnSpacing={2} rowSpacing={2}>
        {props.buttonOnTop ? submitButton : null}
        <Grid item xs={12}>
          <Controller
            name="name"
            control={form.control}
            render={({ field }) => {
              return skeletonState ? (
                <Skeleton height="56px" />
              ) : (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  required
                  helperText={
                    !form.formState.errors.name?.message && t("nameHelperText")
                  }
                  label={t("nameLabel")}
                  inputProps={{
                    autoCorrect: "none",
                    spellCheck: false,
                  }}
                  fullWidth
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
          {skeletonState ? (
            <Skeleton height="56px" />
          ) : (
            <MuiFileInput
              fullWidth
              value={appIconFileValue}
              onChange={handleFileChange}
              helperText={t("appIconHelperText")}
              label={t("appIconLabel")}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="seedColor"
            control={form.control}
            render={({ field }) => {
              return skeletonState ? (
                <Skeleton height="56px" />
              ) : (
                <Box>
                  <MuiColorInput
                    onBlur={() => field.onBlur()}
                    value={field.value ?? "#"}
                    name={field.name}
                    ref={field.ref}
                    fullWidth
                    format="hex"
                    isAlphaHidden
                    label={t("seedColorLabel")}
                    error={form.formState.errors.seedColor ? true : false}
                    required
                    onChange={(value) => {
                      field.onChange({
                        target: {
                          value,
                        },
                      });
                    }}
                  />
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid item>
                      <FormHelperText sx={{ pl: 2 }}>
                        {!form.formState.errors.seedColor?.message &&
                          t("seedColorHelperText")}
                      </FormHelperText>
                    </Grid>
                    <Grid item>
                      <IconButton
                        size="small"
                        onClick={() => {
                          field.onChange({
                            target: {
                              value: randomColor(),
                            },
                          });
                        }}
                      >
                        <ShuffleIcon fontSize="inherit" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
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
              return skeletonState ? (
                <Skeleton height="56px" />
              ) : (
                <FormControl fullWidth>
                  <Autocomplete
                    value={field.value ?? "Roboto"}
                    disablePortal
                    onChange={(_event: any, newValue: string | null) => {
                      if (newValue) {
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
                      <TextField
                        {...params}
                        name={field.name}
                        label={t("fontFamilyLabel")}
                      />
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
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Grid item>
                        <FormHelperText>
                          <MuiLink
                            color="secondary"
                            target="_blank"
                            rel="noopener noreferrer"
                            href={"https://fonts.google.com"}
                            component={NextLink}
                          >
                            {t("fontFamilyHelperLinkText")}
                          </MuiLink>
                        </FormHelperText>
                      </Grid>
                      <Grid item>
                        <IconButton
                          size="small"
                          onClick={() => {
                            field.onChange({
                              target: {
                                value: randomFont(),
                              },
                            });
                          }}
                        >
                          <ShuffleIcon fontSize="inherit" />
                        </IconButton>
                      </Grid>
                    </Grid>
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
            name="useMaterial3"
            control={form.control}
            render={({ field }) =>
              skeletonState ? (
                <Skeleton height="56px" />
              ) : (
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    {t("appearanceLabel")}
                  </FormLabel>
                  <RadioGroup
                    {...field}
                    value={field.value == null ? null : `${field.value}`} // Convert the boolean value to string for the RadioGroup
                    row
                  >
                    <FormControlLabel
                      key={"modern"}
                      value="true"
                      onClick={(e) => {
                        field.onChange({
                          target: {
                            value: true,
                          },
                        });
                      }}
                      control={<Radio />}
                      label={t("useMaterial3Labels.true")}
                    />
                    <FormControlLabel
                      key={"classic"}
                      value="false"
                      onClick={(e) => {
                        field.onChange({
                          target: {
                            value: false,
                          },
                        });
                      }}
                      control={<Radio />}
                      label={t("useMaterial3Labels.false")}
                    />
                  </RadioGroup>
                </FormControl>
              )
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="themeMode"
            control={form.control}
            render={({ field }) => {
              return skeletonState ? (
                <Skeleton height="56px" />
              ) : (
                <FormControl>
                  <FormLabel>{t("themeModeLabel")}</FormLabel>
                  <RadioGroup
                    {...field}
                    value={field.value ? `${field.value}` : null}
                    row
                    onChange={(e) => {}}
                  >
                    {mapStringEnum(ThemeModeEnum, (value) => {
                      return (
                        <FormControlLabel
                          key={value}
                          onChange={() => {
                            field.onChange({
                              target: {
                                value: `${value}`,
                              },
                            });
                          }}
                          value={value}
                          control={<Radio />}
                          label={t("themeModeValues." + value)}
                        />
                      );
                    })}
                  </RadioGroup>
                  <FormHelperText>{t("themeModeHelperText")}</FormHelperText>
                </FormControl>
              );
            }}
          />
        </Grid>
        {!props.buttonOnTop ? submitButton : null}

        <Grid item xs={12} pt={0}>
          <Box textAlign="center">
            {skeletonState ? (
              <Skeleton height="56px" />
            ) : (
              <Button
                endIcon={<ShuffleIcon />}
                size="small"
                color="inherit"
                onClick={() => {
                  unstable_batchedUpdates(() => {
                    form.setValue("seedColor", randomColor());
                    form.setValue("fontFamily", randomFont());
                    form.setValue("useMaterial3", Math.random() < 0.5);
                    form.setValue(
                      "themeMode",
                      Math.random() < 0.5
                        ? ThemeModeEnum.Light
                        : ThemeModeEnum.Dark
                    );
                  });
                }}
              >
                {t("randomizeAllButtonText")}
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
