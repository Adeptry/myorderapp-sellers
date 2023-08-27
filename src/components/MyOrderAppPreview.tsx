import { Box, SxProps } from "@mui/material";
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";
import MessagingIframe from "./messaging-iframe/MessagingIframe";
import { WindowMessage } from "./messaging-iframe/WindowMessage";

export function MyOrderAppPreview(props: {
  sx?: SxProps;
  theme: {
    name: string | null;
    seedColor: string | null;
    fontFamily: string | null;
    useMaterial3: boolean | null;
    themeMode: string | null;
  } | null;
  environment: {
    apiBaseUrl: string | null;
    apiKey: string | null;
    merchantFrontendUrl: string | null;
    merchantId: string | null;
    isPreview: boolean | null;
  } | null;
}) {
  const { sx } = props;

  return (
    <Box sx={{ ...sx }}>
      <DeviceFrameset device="HTC One" color="black">
        <MessagingIframe
          id="flutter-iframe"
          src={process.env.NEXT_PUBLIC_APP_PREVIEW_URL!}
          sendMessageState={{
            type: "state",
            payload: {
              theme: props.theme,
              environment: props.environment,
            },
          }}
          onReceiveMessage={(message: WindowMessage<string>) => {}}
          style={{
            width: "100%",
            height: "100%",
            border: 0,
          }}
        />
      </DeviceFrameset>
    </Box>
  );
}
