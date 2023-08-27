import { Box, SxProps } from "@mui/material";
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";
import { useBoolean } from "usehooks-ts";
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
  const { value: readyForThemeState, setTrue: setReadyForThemeStateTrue } =
    useBoolean(false);
  const {
    value: readyForEnvironmentState,
    setTrue: setReadyForConfigStateTrue,
  } = useBoolean(false);

  return (
    <Box sx={{ ...sx }}>
      <DeviceFrameset device="HTC One" color="black">
        <MessagingIframe
          id="flutter-iframe"
          src={process.env.NEXT_PUBLIC_APP_PREVIEW_URL!}
          sendMessageState={{
            type: "state",
            payload: {
              theme: readyForThemeState ? props.theme : null,
              environment: readyForEnvironmentState ? props.environment : null,
            },
          }}
          onReceiveMessage={(message: WindowMessage<string>) => {
            if (message.type === "event") {
              if (message.payload === "ready_for_theme") {
                setReadyForThemeStateTrue();
              } else if (message.payload === "ready_for_environment") {
                setReadyForConfigStateTrue();
              }
            }
          }}
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
