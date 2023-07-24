import { AppConfigForm } from "@/components/forms/AppConfigForm";
import { Box, Grid } from "@mui/material";
import { Root } from "@radix-ui/react-aspect-ratio";
import { AppConfig } from "moa-merchants-ts-axios";
import { useState } from "react";
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";

export function Configurator(props: {
  autoFocus?: boolean;
  onSuccess: (appConfig: AppConfig) => void;
}) {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <AppConfigForm
            onChange={(field, value) => {
              const iframe = document.getElementById(
                "flutter-iframe"
              ) as HTMLIFrameElement;
              iframe.contentWindow!.postMessage({ [field]: value }, "*");
            }}
            onSuccess={props.onSuccess}
          />
        </Grid>
        <Grid item xs={6}>
          <Root ratio={9 / 16} style={{ width: "100%" }}>
            <DeviceFrameset
              device="Nexus 5"
              color="gold"
              // @ts-ignore
              width="100%"
              // @ts-ignore
              height="100%"
            >
              <iframe
                id="flutter-iframe"
                src="https://moa-cafe.web.app/"
                style={{ width: "100%", height: "100%", border: 0 }}
              />
            </DeviceFrameset>
          </Root>
        </Grid>
      </Grid>
    </Box>
  );
}
