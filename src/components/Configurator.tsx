import { AppConfigForm } from "@/components/forms/AppConfigForm";
import { TabContext, TabList } from "@mui/lab";
import { Box, Grid, Stack, Tab, useMediaQuery, useTheme } from "@mui/material";
import { AppConfig, ConfigUpdateDto } from "moa-merchants-ts-axios";
import { useState } from "react";
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";

export function Configurator(props: {
  shouldAutoFocus?: boolean;
  onSuccess: (appConfig: AppConfig) => void;
  submitText: string;
  preloading?: boolean;
  defaultValues?: ConfigUpdateDto;
}) {
  const { shouldAutoFocus, submitText, onSuccess, preloading, defaultValues } =
    props;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(780));
  const [value, setValue] = useState("0");

  return (
    <Stack>
      <Box display={isSmallScreen ? "block" : "none"}>
        <TabContext value={value}>
          <TabList
            sx={{ pb: 3 }}
            variant="fullWidth"
            onChange={(e, v) => setValue(v)}
            aria-label="lab API tabs example"
          >
            <Tab label="Options" value="0" />
            <Tab label="Preview" value="1" />
          </TabList>
        </TabContext>
      </Box>

      <Grid container spacing={2}>
        <Grid
          item
          xs={isSmallScreen ? 12 : 6}
          display={isSmallScreen ? (value !== "0" ? "none" : "flex") : "flex"}
          justifyContent="center"
        >
          <AppConfigForm
            onChange={(field, value) => {
              const iframe = document.getElementById(
                "flutter-iframe"
              ) as HTMLIFrameElement;
              iframe.contentWindow!.postMessage({ [field]: value }, "*");
            }}
            preloading={preloading}
            submitText={submitText}
            onSuccess={onSuccess}
            shouldAutoFocus={shouldAutoFocus}
            defaultValues={defaultValues}
          />
        </Grid>
        <Grid
          item
          xs={isSmallScreen ? 12 : 6}
          display={isSmallScreen ? (value !== "1" ? "none" : "flex") : "flex"}
          justifyContent="center"
        >
          <DeviceFrameset
            device="HTC One"
            color="black"
            // // @ts-ignore
            // width="100%"
            // // @ts-ignore
            // height="100%"
          >
            <iframe
              id="flutter-iframe"
              src="https://moa-cafe.web.app/"
              style={{ width: "100%", height: "100%", border: 0 }}
            />
          </DeviceFrameset>
        </Grid>
      </Grid>
    </Stack>
  );
}
