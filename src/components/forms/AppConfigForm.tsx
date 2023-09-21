"use client";

import { useCookieContext } from "@/contexts/CookieContext";
import { fontNames } from "@/data/fontNames";
import { configurationForSession } from "@/utils/configurationForSession";
import { logger } from "@/utils/logger";
import { mapStringEnum } from "@/utils/mapStringEnum";
import { moaEnv } from "@/utils/moaEnv";
import { randomColor } from "@/utils/randomColor";
import { stringToColor } from "@/utils/stringToColor";
import { toMoaAppUrl } from "@/utils/toMoaAppUrl";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { yupResolver } from "@hookform/resolvers/yup";
import { Save } from "@mui/icons-material";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
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
  AppConfigsApi,
  AppConfigsApiFp,
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
import { Merge } from "type-fest";
import * as yup from "yup";

type AppConfigFormType = Merge<
  AppConfigUpdateDto,
  { file: File | null | undefined }
>;

export function AppConfigForm(props: {
  buttonOnTop?: boolean;
  successUrl?: string;
  onChange?: (appConfig: AppConfig) => void;
}) {
  const { onChange, successUrl } = props;
  const { push } = useRouter();
  const theme = useTheme();
  const t = useTranslations("AppConfigForm");
  const common = useTranslations("Common");
  const [errorString, setErrorString] = useState<string | null>(null);
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  const [skeletonState, setSkeletonState] = useState(true);
  const [fontInputState, setFontInputState] = useState("");
  const { setColorCookieValue, colorCookieValue } = useCookieContext();

  const {
    formState: { isDirty, errors, isSubmitting },
    control,
    watch,
    setError,
    handleSubmit,
    setValue,
  } = useForm<AppConfigFormType>({
    defaultValues: async () => {
      const session = await getSession();

      if (session) {
        try {
          const response = await (
            await AppConfigsApiFp(
              configurationForSession(session)
            ).getMeAppConfig(undefined, "merchant")
          )();
          const myConfig = response.data;
          let file: File | undefined = undefined;
          const iconFileUrlString = myConfig.iconFile?.url;
          if (iconFileUrlString) {
            const url = new URL(iconFileUrlString);

            const filename = decodeURIComponent(
              url.pathname.split("/").pop() ?? ""
            ).replace(/^\d+-/, "");
            const response = await fetch(iconFileUrlString);
            const buffer = await response.arrayBuffer();
            const blob = new Blob([buffer], { type: "image/*" });
            file = new File([blob], filename, { type: "image/*" });
          }

          onChange ? onChange(myConfig) : {};
          return {
            name: myConfig.name ?? "",
            seedColor: myConfig.seedColor ?? "#",
            fontFamily: myConfig.fontFamily ?? moaEnv.defaultFontFamily,
            themeMode: myConfig.themeMode ?? ThemeModeEnum.Light,
            useMaterial3: myConfig.useMaterial3 ?? false,
            file: file,
          };
        } catch (error) {
          const currentMerchantResponse = await (
            await MerchantsApiFp(
              configurationForSession(session)
            ).getMeMerchant(true)
          )();
          const currentMerchant = currentMerchantResponse?.data;
          const currentUser = currentMerchant?.user;
          const firstName = currentUser?.firstName;
          const lastName = currentUser?.lastName;
          const fullName = `${firstName ?? ""} ${lastName ?? ""}`;
          return {
            name: t("defaultName", { name: firstName }),
            seedColor: colorCookieValue ?? stringToColor(fullName),
            fontFamily: moaEnv.defaultFontFamily,
            themeMode: ThemeModeEnum.Light,
            useMaterial3: false,
            file: null,
          };
        } finally {
          setSkeletonState(false);
        }
      } else {
        throw new Error("Session data not available");
      }
    },
    resolver: yupResolver<AppConfigFormType>(
      yup
        .object<AppConfigFormType>()
        .shape({
          name: yup.string().min(3).label(t("nameLabel")).required(),
          seedColor: yup
            .string()
            .matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/)
            .label(t("seedColorLabel"))
            .required(t("seedColorRequired")),
          file: yup.mixed<File>().label(t("appIconLabel")).required(),
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

  const watchedSeedColor = watch("seedColor");

  useEffect(() => {
    if (watchedSeedColor) {
      setColorCookieValue(watchedSeedColor);
    }
  }, [watchedSeedColor]);

  useEffect(() => {
    const subscription = watch((value) => {
      onChange ? onChange(value) : {};
      setErrorString(null);
    });
    return () => subscription.unsubscribe();
  }, [watch()]);

  const patchMeAppConfigMutation = useMutation({
    mutationFn: async (data: AppConfigFormType) => {
      if (!isDirty) {
        return true;
      }
      const api = new AppConfigsApi(sessionedApiConfiguration);

      await api.patchMeAppConfig({ appConfigUpdateDto: data });

      if (data.file) {
        await api.postMeIconUpload({ file: data.file });
      }

      return true;
    },
  });

  const randomFont = () => {
    return fontNames[Math.floor(Math.random() * fontNames.length)];
  };

  async function handleOnValidSubmit(data: AppConfigFormType) {
    try {
      const response = await patchMeAppConfigMutation.mutateAsync(data);

      if (!response) {
        throw new Error("App config not updated");
      }

      if (successUrl) {
        push(successUrl);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const fields = (error?.response?.data as any)?.fields;
        const message = (error?.response?.data as any)?.message;
        if (fields !== undefined && Object.keys(fields).length > 0) {
          Object.keys(fields).forEach((fieldName) => {
            setError(fieldName as keyof AppConfigFormType, {
              type: "server",
              message: fields[fieldName],
            });
          });
        } else if (message != undefined) {
          setErrorString(message);
        }
      } else {
        setErrorString(JSON.stringify(error));
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
          {errorString && (
            <Alert severity="error" style={{ width: "100%" }}>
              {errorString}
            </Alert>
          )}
          <LoadingButton
            loading={patchMeAppConfigMutation.isLoading || isSubmitting}
            size="large"
            startIcon={<Save />}
            disabled={patchMeAppConfigMutation.isLoading}
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
      onSubmit={handleSubmit(handleOnValidSubmit)}
      sx={{ width: "100%" }}
      noValidate
    >
      <Grid container columnSpacing={2} rowSpacing={2}>
        {props.buttonOnTop ? submitButton : null}
        <Grid item xs={12}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => {
              return skeletonState ? (
                <Skeleton height="56px" />
              ) : (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  required
                  helperText={
                    !errors.name?.message &&
                    `${t("nameHelperText")} ${toMoaAppUrl(field.value ?? "")}`
                  }
                  label={t("nameLabel")}
                  inputProps={{
                    autoCorrect: "none",
                    spellCheck: false,
                  }}
                  fullWidth
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
          {skeletonState ? (
            <Skeleton height="56px" />
          ) : (
            <Controller
              name="file"
              control={control}
              render={(renderer) => (
                <MuiFileInput
                  {...renderer.field}
                  fullWidth
                  helperText={
                    errors.file?.message
                      ? errors.file?.message
                      : t("appIconHelperText")
                  }
                  label={t("appIconLabel")}
                  error={renderer.fieldState.invalid}
                  hideSizeText
                />
              )}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="seedColor"
            control={control}
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
                    error={errors.seedColor ? true : false}
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
                        {!errors.seedColor?.message && t("seedColorHelperText")}
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
            {errors.seedColor?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="fontFamily"
            control={control}
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
                  {!errors.fontFamily?.message && (
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
            {errors.fontFamily?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="useMaterial3"
            control={control}
            render={(renderer) =>
              skeletonState ? (
                <Skeleton height="56px" />
              ) : (
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    {t("appearanceLabel")}
                  </FormLabel>
                  <RadioGroup
                    {...renderer.field}
                    value={
                      renderer.field.value == null
                        ? null
                        : `${renderer.field.value}`
                    }
                    row
                  >
                    <FormControlLabel
                      key={"modern"}
                      value={"true"}
                      control={<Radio />}
                      label={t("useMaterial3Labels.true")}
                      onChange={() => {
                        logger.info(
                          `FormControlLabel set useMaterial3: ${true}`
                        );
                        renderer.field.onChange({
                          target: {
                            value: `true`,
                          },
                        });
                      }}
                    />
                    <FormControlLabel
                      key={"classic"}
                      value={"false"}
                      control={<Radio />}
                      label={t("useMaterial3Labels.false")}
                      onChange={() => {
                        logger.info(
                          `FormControlLabel set useMaterial3: ${false}`
                        );
                        renderer.field.onChange({
                          target: {
                            value: `false`,
                          },
                        });
                      }}
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
            control={control}
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
                    setValue("seedColor", randomColor());
                    setValue("fontFamily", randomFont());
                    setValue("useMaterial3", Math.random() < 0.5);
                    setValue(
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
