import { moaEnv } from "@/moaEnv";
import { configurationForSession } from "@/utils/configurationForSession";
import { fontNames } from "@/utils/fontNames";
import { getBooleanNullOrThrow } from "@/utils/forceHtmlRadioOutputToBeBoolean";
import { mapStringEnum } from "@/utils/mapStringEnum";
import { randomColor } from "@/utils/randomColor";
import { stringToColor } from "@/utils/stringToColor";
import { stringToThemeMode } from "@/utils/stringToThemeMode";
import { toMoaAppUrl } from "@/utils/toMoaAppUrl";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { yupResolver } from "@hookform/resolvers/yup";
import { InfoOutlined, Save } from "@mui/icons-material";
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
  Tooltip,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { default as MuiLink } from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { MuiColorInput } from "mui-color-input";
import { MuiFileInput } from "mui-file-input";
import {
  AppConfigEntity,
  AppConfigsApi,
  MerchantsApi,
  ThemeModeEnum,
} from "myorderapp-square";
import { getSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { default as NextLink } from "next/link";
import { useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useCookieContext } from "../providers/CookieContext";

type FormType = {
  fontFamily?: string | null;
  name?: string | null;
  seedColor?: string | null;
  themeMode?: string | null;
  useMaterial3?: string | null;
  file?: File | null;
};

export function AppConfigForm(props: {
  buttonOnTop?: boolean;
  successUrl?: string;
  autoFocus?: boolean;
  onChange?: (appConfig: AppConfigEntity) => void;
}) {
  const { onChange, successUrl, autoFocus } = props;
  const { push } = useRouter();
  const theme = useTheme();
  const t = useTranslations("AppConfigForm");
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
  } = useForm<FormType>({
    defaultValues: async () => {
      const session = await getSession();

      if (session) {
        try {
          const response = await new AppConfigsApi(
            configurationForSession(session)
          ).getAppConfigMe({ actingAs: "merchant" });
          const myConfig = response.data;
          let file: File | undefined = undefined;
          const iconFileFullUrl = myConfig.iconFileFullUrl;
          if (iconFileFullUrl) {
            const url = new URL(iconFileFullUrl);

            const filename = decodeURIComponent(
              url.pathname.split("/").pop() ?? ""
            ).replace(/^\d+-/, "");
            const response = await fetch(iconFileFullUrl);
            const buffer = await response.arrayBuffer();
            const blob = new Blob([buffer], { type: "image/*" });
            file = new File([blob], filename, { type: "image/*" });
          }

          onChange ? onChange(myConfig) : {};
          return {
            name: myConfig.name ?? "",
            seedColor: myConfig.seedColor ?? "#",
            fontFamily:
              myConfig.fontFamily ?? moaEnv.appConfig.defaultFontFamily,
            themeMode: String(myConfig.themeMode ?? ThemeModeEnum.Light),
            useMaterial3: String(myConfig.useMaterial3 ?? false),
            file: file,
          };
        } catch (error) {
          const currentMerchantResponse = await new MerchantsApi(
            configurationForSession(session)
          ).getMerchantMe({ appConfig: true, user: true });
          const currentMerchant = currentMerchantResponse?.data;
          const currentUser = currentMerchant?.user;
          const firstName = currentUser?.firstName;
          const lastName = currentUser?.lastName;
          const fullName = `${firstName ?? ""} ${lastName ?? ""}`;
          return {
            name: "",
            seedColor: colorCookieValue ?? stringToColor(fullName),
            fontFamily: moaEnv.appConfig.defaultFontFamily,
            themeMode: ThemeModeEnum.Light,
            useMaterial3: String(false),
            file: null,
          };
        } finally {
          setSkeletonState(false);
        }
      } else {
        throw new Error("Session data not available");
      }
    },
    resolver: yupResolver<FormType>(
      yup
        .object<FormType>()
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
          useMaterial3: yup.string().required(),
          themeMode: yup.string().required(),
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
      onChange
        ? onChange({
            name: value.name,
            seedColor: value.seedColor,
            fontFamily: value.fontFamily,
            useMaterial3: getBooleanNullOrThrow(value.useMaterial3),
            themeMode: stringToThemeMode(value.themeMode),
          })
        : {};
      setErrorString(null);
    });
    return () => subscription.unsubscribe();
  }, [watch()]);

  const patchAppConfigMeMutation = useMutation({
    mutationFn: async (appConfigUpdateBody: FormType) => {
      const api = new AppConfigsApi(sessionedApiConfiguration);

      await api.patchAppConfigMe({
        appConfigUpdateBody: {
          name: appConfigUpdateBody.name,
          seedColor: appConfigUpdateBody.seedColor,
          fontFamily: appConfigUpdateBody.fontFamily,
          useMaterial3: getBooleanNullOrThrow(appConfigUpdateBody.useMaterial3),
          themeMode: stringToThemeMode(appConfigUpdateBody.themeMode),
        },
      });

      if (appConfigUpdateBody.file) {
        await api.postIconUploadMe({ file: appConfigUpdateBody.file });
      }

      return true;
    },
  });

  const randomFont = () => {
    return fontNames[Math.floor(Math.random() * fontNames.length)];
  };

  async function handleOnValidSubmit(data: FormType) {
    try {
      await patchAppConfigMeMutation.mutateAsync(data);

      if (successUrl) {
        push(successUrl);
      }
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
            loading={patchAppConfigMeMutation.isPending || isSubmitting}
            size="large"
            startIcon={<Save />}
            disabled={patchAppConfigMeMutation.isPending}
            color="secondary"
            type="submit"
            variant="contained"
          >
            {successUrl ? t("saveAndContinue") : t("submitButtonText")}
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
                <Stack>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <TextField
                      {...field}
                      value={field.value ?? ""}
                      autoFocus={autoFocus}
                      required
                      label={t("nameLabel")}
                      inputProps={{
                        autoCorrect: "none",
                        spellCheck: false,
                      }}
                      fullWidth
                      error={errors.name ? true : false}
                    />
                    <Tooltip
                      title={<Typography>{t("nameTooltip")}</Typography>}
                    >
                      <InfoOutlined />
                    </Tooltip>
                  </Stack>
                  <FormHelperText sx={{ pl: 2 }}>
                    {!errors.name?.message &&
                      `${t("nameHelperText")} ${toMoaAppUrl(
                        field.value ?? ""
                      )}`}
                  </FormHelperText>
                </Stack>
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
            <Stack>
              <Stack direction="row" alignItems="center" gap={1}>
                <Controller
                  name="file"
                  control={control}
                  render={(renderer) => (
                    <MuiFileInput
                      {...renderer.field}
                      fullWidth
                      label={t("appIconLabel")}
                      error={renderer.fieldState.invalid}
                      hideSizeText
                    />
                  )}
                />
                <Tooltip title={<Typography>{t("appIconTooltip")}</Typography>}>
                  <InfoOutlined />
                </Tooltip>
              </Stack>
              <FormHelperText sx={{ pl: 2 }}>
                {errors.file?.message
                  ? errors.file?.message
                  : t("appIconHelperText")}
              </FormHelperText>
            </Stack>
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
                  <Stack direction="row" gap={1} alignItems={"center"}>
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
                    <Tooltip
                      title={<Typography>{t("seedColorTooltip")}</Typography>}
                    >
                      <InfoOutlined />
                    </Tooltip>
                  </Stack>
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
                    <Grid item sx={{ pr: 4 }}>
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
                      <Stack direction="row" alignItems="center" gap={1}>
                        <TextField
                          {...params}
                          name={field.name}
                          label={t("fontFamilyLabel")}
                        />
                        <Tooltip
                          title={
                            <Typography>{t("fontFamilyTooltip")}</Typography>
                          }
                        >
                          <InfoOutlined />
                        </Tooltip>
                      </Stack>
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
                      <Grid item sx={{ pr: 4 }}>
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
                <FormControl sx={{ width: "100%" }}>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    {t("appearanceLabel")}
                  </FormLabel>
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap={2}
                    width="100%"
                    justifyContent={"space-between"}
                  >
                    <RadioGroup {...renderer.field} row>
                      <FormControlLabel
                        key={"modern"}
                        value={"true"}
                        control={<Radio />}
                        label={t("useMaterial3Labels.true")}
                      />
                      <FormControlLabel
                        key={"classic"}
                        value={"false"}
                        control={<Radio />}
                        label={t("useMaterial3Labels.false")}
                      />
                    </RadioGroup>
                    <Tooltip
                      title={
                        <Typography>{t("useMaterial3Tooltip")}</Typography>
                      }
                    >
                      <InfoOutlined />
                    </Tooltip>
                  </Stack>
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
                <FormControl sx={{ width: "100%" }}>
                  <FormLabel>{t("themeModeLabel")}</FormLabel>
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap={2}
                    width="100%"
                    justifyContent={"space-between"}
                  >
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
                    <Tooltip
                      title={<Typography>{t("themeModeTooltip")}</Typography>}
                    >
                      <InfoOutlined />
                    </Tooltip>
                  </Stack>

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
                    setValue(
                      "useMaterial3",
                      Math.random() < 0.5 ? "true" : "false"
                    );
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
